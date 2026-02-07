INSERT INTO problems (
  problem_slug,
  problem_name,
  problem_desc,
  problem_tags,
  problem_level
)
VALUES
(
  'titanic-survival-prediction',
  'Titanic Survival Prediction',
  '## 🚢 Titanic Survival Prediction

Predict whether a passenger survived the Titanic disaster.

### 🔍 Features:
- Age, Sex, Ticket Class
- Fare, Family Size

### 🎯 Objective:
Build a **binary classification model** to predict survival.

### 🧠 ML Concepts:
Logistic Regression, feature engineering, evaluation metrics.',
  'ml,classification,logistic-regression',
  'EASY'
),

(
  'house-price-prediction',
  'House Price Prediction',
  '## 🏠 House Price Prediction

Predict house prices using property-related features.

### 🔍 Features:
- Size, Location
- Rooms, Age

### 🎯 Objective:
Train a **regression model** to predict selling price.

### 🧠 ML Concepts:
Linear regression, feature scaling, error metrics.',
  'ml,regression,linear-regression',
  'EASY'
),

(
  'exam-score-prediction',
  'Exam Score Prediction',
  '## 📚 Exam Score Prediction

Predict student exam scores based on academic and lifestyle factors.

### 🔍 Features:
- Study hours
- Attendance
- Sleep duration and quality
- Internet availability
- Study method
- Institutional rating
- Exam difficulty

### 🎯 Objective:
Predict **exam score (0–100)** using regression models.

### 🧠 ML Concepts:
Regression analysis, correlation, feature importance.',
  'ml,regression,education',
  'EASY'
),

(
  'drug-classification',
  'Drug Classification',
  '## 💊 Drug Classification

Predict the type of drug suitable for a patient.

### 🔍 Features:
- Age, Sex
- Blood Pressure
- Cholesterol
- Sodium–Potassium ratio

### 🎯 Objective:
Build a **multi-class classification model**.

### 🧠 ML Concepts:
Decision Trees, feature importance, classification.',
  'ml,classification,medical',
  'EASY'
),

(
  'spam-email-classification',
  'Spam Email Classification',
  '## 📧 Spam Email Classification

Classify emails as spam or not spam.

### 🔍 Input:
Text converted into numerical features.

### 🎯 Objective:
Binary text classification.

### 🧠 ML Concepts:
Naive Bayes, Logistic Regression, text vectorization.',
  'ml,classification,text',
  'EASY'
),

(
  'student-performance-prediction',
  'Student Performance Prediction',
  '## 🎓 Student Performance Prediction

Predict academic performance based on study habits.

### 🔍 Features:
- Attendance
- Study hours
- Previous grades

### 🎯 Objective:
Regression-based score prediction.

### 🧠 ML Concepts:
Overfitting, feature selection, regression.',
  'ml,regression,education',
  'EASY'
),

(
  'customer-churn-prediction',
  'Customer Churn Prediction',
  '## 📉 Customer Churn Prediction

Predict whether a customer will leave a service.

### 🔍 Features:
- Usage behavior
- Subscription duration
- Demographics

### 🎯 Objective:
Binary classification of churn.

### 🧠 ML Concepts:
Class imbalance, logistic regression.',
  'ml,classification,churn',
  'MEDIUM'
),

(
  'telecom-customer-churn',
  'Customer Churn Prediction (Telecom)',
  '## 📊 Telecom Customer Churn

Synthetic telecom dataset inspired by real-world churn behavior.

### 🔍 Features:
- Tenure
- Monthly charges
- Contract type
- Support interactions

### 🎯 Objective:
Predict churn using **logistic regression**.

### 🧠 ML Concepts:
Categorical encoding, ROC-AUC.',
  'ml,classification,binary,logistic-regression',
  'MEDIUM'
),

(
  'customer-segmentation',
  'Customer Segmentation',
  '## 🧩 Customer Segmentation

Group customers based on purchasing behavior.

### 🔍 Features:
- Spending habits
- Frequency
- Customer lifetime value

### 🎯 Objective:
Unsupervised clustering.

### 🧠 ML Concepts:
K-Means, feature scaling, cluster evaluation.',
  'ml,clustering,unsupervised',
  'MEDIUM'
),

(
  'credit-card-fraud-detection',
  'Credit Card Fraud Detection',
  '## 💳 Credit Card Fraud Detection

Detect fraudulent financial transactions.

### ⚠️ Challenge:
Highly imbalanced dataset.

### 🎯 Objective:
Identify fraud using classification or anomaly detection.

### 🧠 ML Concepts:
ROC-AUC, precision-recall, imbalance handling.',
  'ml,classification,anomaly-detection',
  'HARD'
),

(
  'website-classification',
  'Website Classification',
  '## 🌐 Website Classification

Classify websites based on extracted textual content.

### 🔍 Input:
Website text represented using numerical features.

### 🎯 Objective:
Multi-class text classification.

### 🧠 ML Concepts:
TF-IDF, Naive Bayes, Logistic Regression.',
  'ml,nlp,classification',
  'HARD'
),

(
  'outlier-detection-transactions',
  'Outlier Detection in Transactions',
  '## 🚨 Outlier Detection in Transactions

Identify abnormal transaction behavior.

### 🔍 Features:
- Transaction amount
- Frequency
- Time patterns

### 🎯 Objective:
Detect anomalies using unsupervised ML.

### 🧠 ML Concepts:
Isolation Forest, statistical outliers.',
  'ml,anomaly-detection,unsupervised',
  'HARD'
);