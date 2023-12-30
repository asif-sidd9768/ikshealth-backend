// controllers.js
const { Country, State, City } = require("country-state-city");
const { connection } = require("../db/connection");


const insertUserSql = `
  INSERT INTO user
  (first_name, last_name, email, contact, designation, gender, dob, age, photo, country, state, city, pinCode) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const updateUserSql = `
  UPDATE user
  SET
    first_name = ?,
    last_name = ?,
    email = ?,
    contact = ?,
    designation = ?,
    gender = ?,
    dob = ?,
    age = ?,
    photo = ?,
    country = ?,
    state = ?,
    city = ?,
    pinCode = ?
  WHERE id = ?
`;

const buildUpdateQuery = (userData, photo) => {
  let updateFields = [];
  let updateValues = [];
  let userId = userData.id; // assuming user id is available in userData

  // Iterate through userData and add non-null, non-undefined values to the updateFields and updateValues arrays
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && key !== 'id' && value !== "") {
      updateFields.push(`${key} = ?`);
      updateValues.push(value);
    }
  });

  // Check if photo is present and add it to the updateFields and updateValues arrays
  if (photo) {
    updateFields.push('photo = ?');
    updateValues.push(photo.path);
  }

  // Construct the final SQL query
  const updateUserSql = `
    UPDATE user
    SET
      ${updateFields.join(', ')}
    WHERE id = ?
  `;

  // Add userId to the updateValues array
  updateValues.push(userId);

  return { updateUserSql, updateValues };
};

const getAllUsers = (req, res) => {
  connection.query('SELECT * FROM `user`', (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(200).json({ message: 'success', users: results });
    }
  });
};

const getCountries = async (req, res) => {
  try {
    const countries = Country.getAllCountries();
    res.status(200).json({ message: 'success', countries });
  } catch (error) {
    console.error('Error fetching countries:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStates = async (req, res) => {
  try {
    const { country } = req.params;
    const states = State.getStatesOfCountry(country);
    res.status(200).json({ message: 'success', states });
  } catch (error) {
    console.error('Error fetching states:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCities = async (req, res) => {
  try {
    const { country, state } = req.params;
    const cities = City.getCitiesOfState(country, state);
    res.status(200).json({ message: 'success', cities });
  } catch (error) {
    console.error('Error fetching cities:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const fileUpload = async (req, res) => {
  const userData = req.body;
  const photo = req.file;

  const values = [
    userData.firstName,
    userData.lastName,
    userData.email,
    userData.contactNumber,
    userData.designation,
    userData.gender,
    new Date(userData.dob),
    Number(userData.age),
    photo.path,
    userData.country,
    userData.state,
    userData.city,
    Number(userData.pinCode)
  ];

  connection.query(insertUserSql, values, (error, results) => {
    if (error) {
      console.error('Error inserting data:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      connection.query('SELECT * FROM `user`', (error, users) => {
        if (error) {
          res.status(500).json({ message: 'Internal server error' });
        } else {
          res.json({ message: 'Data received successfully!', result: users });
        }
      });
    }
  });
};


const updateUser = (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  const photo = req.file;

  const { updateUserSql, updateValues } = buildUpdateQuery(userData, photo);
  connection.query(updateUserSql, updateValues, (error, results) => {
    if (error) {
      console.error('Error updating data:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      connection.query('SELECT * FROM `user`', (error, users) => {
        if (error) {
          console.error('Error fetching added user:', error.message);
          res.status(500).json({ message: 'Internal server error' });
        } else {
          res.json({ message: 'Data received successfully!', users: users });
        }
      });
    }
  });
};
module.exports = { getAllUsers, getCountries, getStates, getCities, fileUpload, updateUser };
