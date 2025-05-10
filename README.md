# (SlimMom)[https://deepwiki.com/Miro-wq/slm-backend]

## Description 

SlimMom is a modern web application designed to help users monitor their daily calorie intake and track their meals on their weight loss journey. With personalized calculations and food recommendations based on individual health data, SlimMom offers an intuitive way to manage a healthier lifestyle.

## Technologies Used
- **React.js** – A powerful JavaScript library for building dynamic and responsive user interfaces.
- **Material-UI (MUI)** – Provides pre-styled UI components to accelerate design and development.
- **CSS Modules** – Enables modular and maintainable styling for component-based development.
- **MongoDB** – Used as the backend solution for user authentication and PostgreSQL database management.
- **React Router** – Facilitates smooth client-side navigation with protected routes.

## Features 

- **User Authentication**: Secure sign-up and login functionality using Supabase Auth ensures personalized access.
- **Daily Calorie Calculator**: Users can enter personal details such as height, desired weight, age, blood type, and current weight to receive a recommended daily calorie intake.
- **Meal Diary**: Log food consumption by adding entries with product names and serving sizes (grams). Each entry is timestamped and stored in the Supabase database for persistent tracking.
- **Personalized Food Recommendations**: The app analyzes user data—especially blood type—to generate tailored lists of foods that are not recommended, using a curated products dataset.
- **Real-Time Summary**:

    A comprehensive summary displays:
  
    **Left**: Remaining calories for the day.
  
    **Consumed**: Total calories consumed.
  
    **Daily Rate**: The personalized recommended intake.
  
    **n% of Normal**: The percentage of the daily rate that has been consumed.
  
- **Responsive Design**: The layout adapts to different screen sizes, ensuring that key information is always accessible. On larger screens, the summary section is fixed on the side, while on smaller devices, the design adjusts for optimal viewing.
- **Protected Routes**: Sensitive pages such as the Calculator and Diary are accessible only to authenticated users, ensuring data privacy and security.

## What You Can Do With SlimMom
- **Track Your Progress**: Calculate your daily calorie needs and monitor your food intake to stay on track with your weight loss goals.
- **Log Your Meals**: Easily add diary entries to review your eating habits over time.
- **Receive Tailored Diet Insights**: Access personalized food recommendations based on your blood type and other health metrics.
- **Manage Your Wellness Journey**: View real-time summaries that provide insights into your daily consumption and remaining calorie allowance, empowering you to make informed dietary choices.

## Conclusion 

SlimMom brings together modern web technologies and personalized nutrition insights to offer a comprehensive solution for managing a healthier lifestyle.
