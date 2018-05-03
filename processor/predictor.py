import pandas as pd
import numpy as np
import requests
import datetime
import time
import math

from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error as mse
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import KFold
# from sklearn.preprocessing import StandardScaler
# from sklearn.pipeline import Pipeline

import xgboost as xgb

# import tensorflow as tf

from keras.models import Sequential
from keras.layers import Dense, Activation
# from keras.callbacks import TensorBoard
# from keras.wrappers.scikit_learn import KerasRegressor
from keras.layers import LSTM
from keras.layers import Dropout

master = {}

now = datetime.datetime.now()

master['last'] = now.strftime('%m %d %Y %H:%M %p')

bdata = pd.read_html("https://coinmarketcap.com/currencies/bitcoin/historical-data/?start=20150101&end="+time.strftime("%Y%m%d"))[0]

bdata = bdata.assign(Date=pd.to_datetime(bdata['Date']))
bdata['Volume'] = bdata['Volume'].astype('int64')

bdata['LagFive'] = bdata['Close'].shift(5)
bdata['ForwardFive'] = bdata['Close'].shift(-5)

master['momentum'] = ( bdata.iloc[0]['Close'] / bdata.iloc[0]['ForwardFive'] ) * 100

def ExpMovingAverage(values, window):
    weights = np.exp(np.linspace(-1., 0., window))
    weights /= weights.sum()
    a = np.convolve(values, weights, mode='full')[:len(values)]
    a[:window] = a[window]
    return a

ema = ExpMovingAverage(list(reversed(bdata['Close'])), 5)

roc = []
for i, j in zip(bdata['Close'], bdata['LagFive']):
    roc.append((i / j) * 100)

kwargs = {
    'Close Off High': lambda x: 2 * (x['High'] - x['Close']) / (x['High'] - x['Low']) - 1,
    'Volatility': lambda x: (x['High'] - x['Low']) / (x['Open']),
}

bdata = bdata.assign(**kwargs)

mdata = bdata[['Date', 'Close', 'Volume', 'Close Off High', 'Volatility', 'ForwardFive']]
mdata = mdata.sort_values(by='Date')
mdata['EMA'] = ema
mdata['Momentum'] = roc
mdata['Next'] = mdata['Close'].shift(-1)
mdata = mdata.drop([1216, 1215, 1214, 1213, 1212, 0])
mdata = mdata.drop(['Date', 'Close'], axis=1)

feature_cols = ['Volume', 'Close Off High', 'Volatility', 'EMA', 'Momentum', 'ForwardFive']
X = mdata[feature_cols]
Y = mdata['Next']

# Random Forest
rfreg = RandomForestRegressor(n_estimators=1000, max_features=5, oob_score=True, random_state=8)
X_train, X_test, Y_train, Y_test = train_test_split(X,Y, random_state = 122)
rfreg.fit(X_train, Y_train)

master['rf'] = rfreg.predict( X.iloc[-1].values.reshape(1, -1) )[0]

# XGBoost
xgb_model = xgb.XGBRegressor().fit(np.array(X), np.array(Y))

master['xg'] = xgb_model.predict( X.iloc[-1].values.reshape(1, -1) )[0]

# RNN
mdata = bdata[['Date']+['Close']+['Volume']+['Close Off High']+['Volatility']]
mdata = mdata.sort_values(by='Date')
split_date = '2017-07-01'
training_set, test_set = mdata[mdata['Date']<split_date], mdata[mdata['Date']>=split_date]
training_set = training_set.drop('Date', 1)
test_set = test_set.drop('Date', 1)
window_len=10
norm_cols= ['Close', 'Volume']
LSTM_training_inputs = []
for i in range(len(training_set)-window_len):
    temp_set = training_set[i:(i+window_len)].copy()
    for col in norm_cols:
        temp_set.loc[:, col] = temp_set[col]/temp_set[col].iloc[0] - 1
    LSTM_training_inputs.append(temp_set)
LSTM_training_outputs = (training_set['Close'][window_len:].values/training_set['Close'][:-window_len].values)-1
LSTM_test_inputs = []
for i in range(len(test_set)-window_len):
    temp_set = test_set[i:(i+window_len)].copy()
    for col in norm_cols:
        temp_set.loc[:, col] = temp_set[col]/temp_set[col].iloc[0] - 1
    LSTM_test_inputs.append(temp_set)
LSTM_test_outputs = (test_set['Close'][window_len:].values/test_set['Close'][:-window_len].values)-1
LSTM_training_inputs = [np.array(LSTM_training_input) for LSTM_training_input in LSTM_training_inputs]
LSTM_training_inputs = np.array(LSTM_training_inputs)
LSTM_test_inputs = [np.array(LSTM_test_inputs) for LSTM_test_inputs in LSTM_test_inputs]
LSTM_test_inputs = np.array(LSTM_test_inputs)

def build_model(inputs, output_size, neurons, activ_func="relu",
                dropout=0.2, loss="mae", optimizer="adam"):
    model = Sequential()

    model.add(LSTM(neurons, input_shape=(inputs.shape[1], inputs.shape[2])))
    model.add(Dropout(dropout))
    model.add(Dense(units=output_size))
    model.add(Activation(activ_func))

    model.compile(loss=loss, optimizer=optimizer)
    return model

np.random.seed(69)
btc_model = build_model(LSTM_training_inputs, output_size=1, neurons=20)
btc_history = btc_model.fit(LSTM_training_inputs, LSTM_training_outputs, epochs=80, batch_size=128, verbose=0, shuffle=True)

master['rnnmae'] = np.mean(np.abs((np.transpose(btc_model.predict(LSTM_test_inputs))+1)-(test_set['Close'].values[window_len:])/(test_set['Close'].values[:-window_len])))
master['rnn'] =  ((np.transpose(btc_model.predict(LSTM_test_inputs))+1) * test_set['Close'].values[:-window_len])[0][-1]

if __name__ == '__main__':
    # print(master)
    requests.post('http://localhost:3000/update', data=master)
