import pandas as pd
import numpy as np
import requests
import datetime
import time

bdata = pd.read_html("https://coinmarketcap.com/currencies/bitcoin/historical-data/?start=20150101&end="+time.strftime("%Y%m%d"))[0]

bdata = bdata.assign(Date=pd.to_datetime(bdata['Date']))
bdata['Volume'] = bdata['Volume'].astype('int64')

kwargs = {
            'Close Off High': lambda x: 2*(x['High'] - x['Close'])/(x['High'] - x['Low'])-1,
             'Volatility': lambda x: (x['High'] - x['Low'])/(x['Open'])
         }

bdata = bdata.assign(**kwargs)

# Get only relevant columns
mdata = bdata[['Date']+['Close']+['Volume']+['Close Off High']+['Volatility']]
mdata = mdata.sort_values(by='Date')

if __name__ == '__main__':
    requests.post('http://localhost:3000/post', data={'text': 'i was sent'})
