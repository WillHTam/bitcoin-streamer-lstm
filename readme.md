![Stack](https://raw.githubusercontent.com/WillHTam/bitcoin-streamer-lstm/master/stack.jpg)

## How to run
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
- Implement Pickling for SKLearn, DMatrix for XGBoost, and model saving for Keras
- Replace Random Forest with ARIMA?

## Production:
- Host Processor on different server
- Run weight processing with Go / Java
- Use HTTPS 
- Use PGP
