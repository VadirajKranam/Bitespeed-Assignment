const express = require('express')
require('dotenv').config()
const app = express()
app.use(express.json())
const PORT=process.env.PORT||3000
const {getContactByEmail,getContactByPhoneNumber,createContact,createSecondaryContact,updateContactToSecondary,findSecondaryContacts}=require('./utils')
const { connection } = require('./database')
app.post("/identify",async (req, res) => {
    const { email, phoneNumber } = req.body
    const contactWithEmail=await getContactByEmail(email)
    const contactWithPhoneNumber = await getContactByPhoneNumber(phoneNumber)
    JSON.stringify(contactWithEmail)
    JSON.stringify(contactWithPhoneNumber)
    if (contactWithEmail != null && contactWithPhoneNumber != null) {
        await updateContactToSecondary(phoneNumber, contactWithEmail["Id"],email) 
    }
    if (contactWithEmail == null && contactWithPhoneNumber == null){
        const result=await createContact(email, phoneNumber, "primary")
        const resultContact = {
          primaryContatctId: result["insertId"],
            emails: [email],
            phoneNumbers: [phoneNumber],
          secondaryContactIds:[]
        };
      return  res.json({"contact":resultContact})
    }
    if (contactWithEmail != null && contactWithPhoneNumber == null) {
      await createSecondaryContact(
        email,
        phoneNumber,
        "secondary",
        contactWithEmail["Id"]
      );
    }
    if (contactWithPhoneNumber != null && contactWithEmail == null) {
      await createSecondaryContact(
        email,
        phoneNumber,
        "secondary",
        contactWithPhoneNumber["Id"]
      );
    }
    const secondaryContact = await findSecondaryContacts(contactWithEmail["Id"])
    JSON.stringify(secondaryContact)
    if (secondaryContact != null) {
        const emails = [email]
        const phoneNumbers = [contactWithEmail["phoneNumber"]]
        const ids=[]
        for (const contact of secondaryContact) {
            emails.push(contact["email"])
            phoneNumbers.push(contact["phoneNumber"])
            ids.push(contact["Id"])
        }
        const resultContact = {
          primaryContatctId:contactWithEmail["Id"]!=null?contactWithEmail["Id"]:contactWithPhoneNumber["Id"],
          emails: emails,
          phoneNumbers: phoneNumbers,
          secondaryContactIds: ids,
        };
       return res.json({ contact: resultContact });
    }
    res.send("ok")
})

app.listen(PORT, () => {
console.log("Listening to port 3000")
})