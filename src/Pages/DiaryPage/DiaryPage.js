import React, { useState, useEffect, useCallback } from 'react';
import { TextField } from '@mui/material';
import LoginHeader from '../../components/LoginHeader/LoginHeader';
import styles from './DiaryPage.module.css';
import products from '../../data/products.json';

const DiaryPage = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [productName, setProductName] = useState('');
  const [grams, setGrams] = useState('');
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [foodsNotRecommended, setFoodsNotRecommended] = useState([]);
  //   const [calculationDone, setCalculationDone] = useState(false);

  useEffect(() => {
    // pentru foodsNotRecommended, momentan nu functioneaza
    const userBloodType = localStorage.getItem("userBloodType");
    if (userBloodType) {
      const bloodMapping = { A: 1, B: 2, AB: 3, O: 4 };
      const bloodIndex = bloodMapping[userBloodType.toUpperCase()];
      if (bloodIndex) {
        const filteredFoods = products.filter((product) => {
          return (
            product.groupBloodNotAllowed &&
            product.groupBloodNotAllowed[bloodIndex] === true
          );
        });
        setFoodsNotRecommended(filteredFoods);
      } else {
        setFoodsNotRecommended([]);
      }
    } else {
      setFoodsNotRecommended([]);
    }
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem('currentUserId');
    setCurrentUserId(storedUserId);
  }, []);

  const loadDiaryEntries = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(
        `http://localhost:5000/api/diary?entry_date=${selectedDate}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        console.error('Error fetching diary entries:', response.statusText);
      } else {
        const data = await response.json();
        setDiaryEntries(data || []);
      }
    } catch (error) {
      console.error('Error fetching diary entries:', error);
    }
  }, [currentUserId, selectedDate]);

  useEffect(() => {
    loadDiaryEntries();
  }, [selectedDate, currentUserId, loadDiaryEntries]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // intrare în diary
  const handleAddEntry = async () => {
    console.log("Attempting to add entry", { productName, grams, currentUserId, selectedDate });
    if (!productName.trim() || !grams.trim() || !currentUserId) {
      console.error("Missing required fields:", { productName, grams, currentUserId });
      return;
    }
    const newEntry = {
      entry_date: selectedDate,
      product_name: productName.trim(),
      grams: Number(grams),
    };
  
    try {
      const token = localStorage.getItem('jwtToken');
      console.log("Using token:", token);
      const response = await fetch('http://localhost:5000/api/diary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEntry),
      });
      if (!response.ok) {
        console.error('Error inserting diary entry:', response.statusText);
      } else {
        console.log("Diary entry added successfully");
        setProductName('');
        setGrams('');
        loadDiaryEntries();
      }
    } catch (error) {
      console.error('Error inserting diary entry:', error);
    }
  };
  

  // stergere intrare din diary
  const handleDeleteEntry = async (id) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`http://localhost:5000/api/diary/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.error('Error deleting diary entry:', response.statusText);
      } else {
        setDiaryEntries(diaryEntries.filter((entry) => entry._id !== id));
      }
    } catch (error) {
      console.error('Error deleting diary entry:', error);
    }
  };

  const formatDate = (isoDate) => {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  const totalConsumed = diaryEntries.reduce((sum, entry) => {
    const prod = products.find(
      (p) => p.title.toLowerCase() === entry.product_name.toLowerCase()
    );
    if (prod && prod.calories) {
      return sum + (entry.grams / 100) * prod.calories;
    }
    return sum;
  }, 0);

  const dailyRate = Number(localStorage.getItem('dailyRate'));
  const leftCalories = dailyRate - totalConsumed;
  const percentOfNormal = dailyRate ? ((totalConsumed / dailyRate) * 100).toFixed(0) : 0;

  return (
    <div className={styles.container}>
      <LoginHeader />
      <div className={styles.diaryPage}>
        <div className={styles.leftSection}>
          <div className={styles.datePicker}>
            <label htmlFor="diary-date"></label>
            <input
              className={styles.datePickerInput}
              type="date"
              id="diary-date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
          <div className={styles.entryForm}>
            <TextField
              label="Enter product name"
              variant="standard"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ width: '240px', marginRight: '20px' }}
            />
            <TextField
              label="Grams"
              variant="standard"
              type="number"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ width: '240px', marginRight: '20px' }}
            />
            <button
              className={styles.addButton}
              type="button"
              onClick={handleAddEntry}
            >
              +
            </button>
          </div>
          <div className={styles.entriesList}>
            {diaryEntries.length === 0 ? (
              <p>No entries for this date.</p>
            ) : (
              <ul className={styles.diaryFoodList}>
                {diaryEntries.map((entry) => (
                  <li className={styles.diaryFoods} key={entry._id}>
                    {entry.product_name} - {entry.grams} grams
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteEntry(entry._id)}
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className={styles.vector}></div>
        <div className={styles.rightSection}>
          <div className={styles.summary}>
            <div className={styles.summaryHeader}>
              <h3>Summary for {formatDate(selectedDate)}</h3>
              <form className={styles.summaryForm}>
                <div className={styles.summaryItem}>
                  <label>Left:</label>
                  <input
                    className={styles.summaryInput}
                    type="text"
                    value={`${leftCalories.toFixed(0)} kcal`}
                    readOnly
                  />
                </div>
                <div className={styles.summaryItem}>
                  <label>Consumed:</label>
                  <input
                    className={styles.summaryInput}
                    type="text"
                    value={`${totalConsumed.toFixed(0)} kcal`}
                    readOnly
                  />
                </div>
                <div className={styles.summaryItem}>
                  <label>Daily rate:</label>
                  <input
                    className={styles.summaryInput}
                    type="text"
                    value={`${dailyRate} kcal`}
                    readOnly
                  />
                </div>
                <div className={styles.summaryItem}>
                  <label>n% of normal:</label>
                  <input
                    className={styles.summaryInput}
                    type="text"
                    value={`${percentOfNormal}%`}
                    readOnly
                  />
                </div>
              </form>
            </div>
            <div className={styles.summaryText}>
              <h4>Food not recommended:</h4>
              {foodsNotRecommended.length > 0 ? ( // nu afiseaza daca exista recomandari ?????????
                <div className={styles.foodsNotRecommended}>
                  <ul className={styles.foodList}>
                    {foodsNotRecommended.map((food, index) => (
                      <li key={index}>{food.title}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No recommendations available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryPage;
