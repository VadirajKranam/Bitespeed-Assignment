const { connection } =require('./database')
function getContactByEmail(email) {
  const query = "SELECT * FROM CONTACT WHERE email = ?";
  return new Promise((resolve, reject) => {
    connection.query(query, [email], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}
function getContactByPhoneNumber(phoneNumber) {
  const query = "SELECT * FROM CONTACT WHERE phoneNumber = ?";
  return new Promise((resolve, reject) => {
    connection.query(query, [phoneNumber], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}
function createContact(email, phoneNumber, linkPrecedence) {
  const query =
    "INSERT INTO CONTACT (email, phoneNumber,linkPrecedence) VALUES (?, ?, ?)";
  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [email, phoneNumber, linkPrecedence],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

function createSecondaryContact(email, phoneNumber, linkPrecedence, linkedId) {
  const query =
    "INSERT INTO CONTACT (email, phoneNumber,linkPrecedence,linkedId) VALUES (?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [email, phoneNumber, linkPrecedence, linkedId],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}
function updateContactToSecondary(phoneNumber, linkedId, email) {
  const query =
    "UPDATE CONTACT SET linkPrecedence=?,linkedId=? where phoneNumber=? and not email=?";
  return new Promise((resolve, reject) => {
    connection.query(
      query,
      ["secondary", linkedId, phoneNumber, email],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}
function findSecondaryContacts(linkedId) {
  const query = "SELECT Id,phoneNumber,email FROM CONTACT where linkedId=?";
  return new Promise((resolve, reject) => {
    connection.query(query, [linkedId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}
module.exports = {
  getContactByEmail,
  getContactByPhoneNumber,
  createContact,
  createSecondaryContact,
  updateContactToSecondary,
  findSecondaryContacts,
};
