# Yeet

![Stack](https://raw.githubusercontent.com/WillHTam/bitcoin-streamer-lstm/master/stack.jpg)

- install dependencies with `yarn`

- any changes to the frontend must be accompanied by `yarn build` in the 'client' folder

- run with `node server.js`

- view frontend on `http://localhost:3000`

- processor should be run with cronjob

- need to `sudo chmod 777 processsor` to disable read-only on notebooks

- `gcloud compute ssh <INSTANCE NAME>`

## TODO:
- Add Firebase DB to save previous values, accuracy, etc.
- Tune hyperparameters and features for XGBoost
- Replace Random Forest with ARIMA
