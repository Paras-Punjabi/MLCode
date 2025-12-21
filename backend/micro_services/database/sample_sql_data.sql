INSERT INTO problems (problem_id, problem_name, problem_desc, problem_tags, problem_level)
VALUES
('44bf1176-39f9-4aba-9668-c066f9e85541',
 'Titanic Survival Prediction',
 'Predict whether a passenger survived the Titanic disaster based on passenger attributes like age, sex, class, and fare.',
 'classification,logistic-regression,feature-engineering',
 'EASY'),

('31424652-f121-4b2f-8261-40b02fd4c568',
 'House Price Prediction',
 'Predict the selling price of houses based on features like size, location, number of rooms, and age of the property.',
 'regression,linear-regression,tabular-data',
 'EASY'),

('b112ad7c-5ff1-4e1e-af73-6de782db29fd',
 'MNIST Digit Recognition',
 'Classify handwritten digits (0-9) from image pixel data.',
 'classification,cnn,computer-vision',
 'MEDIUM'),

('6aff94b0-d924-491f-b627-72b87bed6f21',
 'Sentiment Analysis on Movie Reviews',
 'Predict the sentiment (positive or negative) of movie reviews based on text data.',
 'nlp,classification,sentiment-analysis,text-processing',
 'MEDIUM'),

('f875fa47-09a9-4320-96b6-cb39a34eef02',
 'Customer Churn Prediction',
 'Predict whether a customer will leave a subscription service based on usage patterns, demographics, and history.',
 'classification,churn,business,tabular-data',
 'MEDIUM'),

('234de512-e755-4327-921e-b515200a163a',
 'Credit Card Fraud Detection',
 'Detect fraudulent credit card transactions from anonymized transaction data.',
 'anomaly-detection,classification,imbalanced-data',
 'HARD'),

('54a65265-2fa1-4306-8beb-c7a5f46e94d3',
 'Image Captioning',
 'Generate a caption for an image using deep learning models.',
 'computer-vision,nlp,sequence-modeling',
 'HARD'),

('5190d55b-c38c-4612-93f5-514466cc7f40',
 'Stock Price Prediction',
 'Predict the next-day stock price movement (up/down) based on historical price data and trading volume.',
 'regression,time-series,forecasting',
 'MEDIUM'),

('ed491506-22ab-48e4-a2ae-a3ae2ad9431c',
 'Fake News Detection',
 'Classify whether a given news article is real or fake based on its headline and content.',
 'nlp,classification,text-processing,misinformation',
 'HARD'),

('b100f75a-ca4a-4551-9597-69c03f02449a',
 'Breast Cancer Prediction',
 'Predict whether a tumor is malignant or benign based on medical diagnostic features.',
 'classification,healthcare,medical-data',
 'EASY');

INSERT INTO users (user_id, user_name, user_email, user_roles)
VALUES
('b7a3fd0d-7fa8-4d18-b8ab-f5b8d056d1a1', 'paras', 'paras@example.com', ARRAY['USER','ADMIN']::user_role[]),
('6e96f392-b3c4-4bd5-90b2-1e4147a1c519', 'chandrasekhar', 'chandrasekhar@example.com', ARRAY['USER','ADMIN']::user_role[]),
('f7488290-54fd-46a8-9c7b-9f7b282ecdc2', 'aakash', 'aakash@example.com', ARRAY['USER']::user_role[]),
('8c71fb99-7f35-43e2-af71-222e4eafc4b1', 'rohan', 'rohan@example.com', ARRAY['USER']::user_role[]),
('dc3c0136-4da4-4d98-bc58-dfe6a7e2e603', 'mehul', 'mehul@example.com', ARRAY['USER']::user_role[]),
('75ad2e55-256d-4c58-8f72-0b2f8dc94337', 'yash', 'yash@example.com', ARRAY['USER']::user_role[]),
('a24fb542-8be0-4f53-9186-7c88deb6a77f', 'sahil', 'sahil@example.com', ARRAY['USER']::user_role[]),
('0e69f6ea-4d1c-4415-a23b-79ecba1338b9', 'karan', 'karan@example.com', ARRAY['USER']::user_role[]),
('e7d84fd4-08ff-496d-90e8-2370486b61bb', 'amit', 'amit@example.com', ARRAY['USER']::user_role[]),
('1a3dfdd4-f3dd-4e85-8c90-29e45772133b', 'deepak', 'deepak@example.com', ARRAY['USER']::user_role[]);

INSERT INTO submissions (submission_id, user_id, problem_id, status)
VALUES
('8c41b96e-6ce5-4a17-9e10-e76f2de1ebd2', 'b7a3fd0d-7fa8-4d18-b8ab-f5b8d056d1a1', '44bf1176-39f9-4aba-9668-c066f9e85541', 'ACCEPTED'),
('f3a53cd8-3024-46b5-80b4-26bb4cd0662d', 'f7488290-54fd-46a8-9c7b-9f7b282ecdc2', '31424652-f121-4b2f-8261-40b02fd4c568', 'ATTEMPTED'),
('dc2f6a2e-3432-4519-a42b-ff44be9e8450', '6e96f392-b3c4-4bd5-90b2-1e4147a1c519', 'b112ad7c-5ff1-4e1e-af73-6de782db29fd', 'ACCEPTED'),
('a30f32d3-c4fe-43b8-a5d0-3a842e15f52c', '0e69f6ea-4d1c-4415-a23b-79ecba1338b9', '6aff94b0-d924-491f-b627-72b87bed6f21', 'ATTEMPTED'),
('9dffc72b-5b1e-4a2e-9f4c-c0d28a20d998', '1a3dfdd4-f3dd-4e85-8c90-29e45772133b', 'f875fa47-09a9-4320-96b6-cb39a34eef02', 'ACCEPTED'),
('bcd282a1-a622-4bc0-a77b-72ea63dd11c1', 'a24fb542-8be0-4f53-9186-7c88deb6a77f', '234de512-e755-4327-921e-b515200a163a', 'ATTEMPTED'),
('5cf41484-4b4a-412a-8d0a-01b665cdd0dc', '75ad2e55-256d-4c58-8f72-0b2f8dc94337', '54a65265-2fa1-4306-8beb-c7a5f46e94d3', 'ACCEPTED'),
('e54ef9c3-9b4a-45e4-a905-6d8616491a1e', 'dc3c0136-4da4-4d98-bc58-dfe6a7e2e603', '5190d55b-c38c-4612-93f5-514466cc7f40', 'ATTEMPTED'),
('c4ecb5da-71dc-4d54-aa43-86c6661ab18c', '8c71fb99-7f35-43e2-af71-222e4eafc4b1', 'ed491506-22ab-48e4-a2ae-a3ae2ad9431c', 'ACCEPTED'),
('5cbdbe07-6f4f-4fdd-80b2-0cb84235c0a5', 'e7d84fd4-08ff-496d-90e8-2370486b61bb', 'b100f75a-ca4a-4551-9597-69c03f02449a', 'ATTEMPTED');
