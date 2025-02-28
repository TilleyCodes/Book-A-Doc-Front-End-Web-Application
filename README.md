# Book-A-Doc Front End Web Application

## Pages
### **React Browser Tree**
* **HEADER**
  * Nav
    * About Us
    * Login
    * Sign up
      * Patient Sign Up
    * Logout _(auth)_
* **HOME/MAIN**
  * General Practitioners
    * Booking button _(auth)_
  * My Appointments _(auth)_
  * Medical Centres
    * Booking button _(auth)_
* **FOOTER**
  * Contact
  * Terms & Conditions
  * Privacy Policy

## Style Guide
* **font-family**:
* **Colors**:
  * --primary:
  * --Secondary:
  * --main-font:
  * --sec-font:

### Home
![home page](./public/media/readme-images/home.png)

Patient can search for a GP or med centre without logging in. However if the patient wants to make a booking, a pop up will direct them to either log in or sign up.

![home page](./public/media/readme-images/pop-up.png)

### Patient Sign Up
![home page](./public/media/readme-images/patient-signup.png)

### Patient Log In
![home page](./public/media/readme-images/patient-login.png)

If the user forgets their password, they can reset using their registered email.

### Patient Logged in
![home page](./public/media/readme-images/patient-logged-in.png)

Once the patient has logged in, "My Appointments" will appear on the home page as an option. For new patients this section is blank until they have made their first appointment.

### General Practitioners
![home page](./public/media/readme-images/gen-prac.png)

Each GP will have a profile:
- Name
- Specialty
- Medical Centre
- Available date and time
- Book button

### Medical Centres
![home page](./public/media/readme-images/med-centres.png)

Each medical centre will show:
- Medical centre name
- Address
- Contacts
- Opening hours
- List of Drs

Clicking on the Dr will bring the patient to the GP page to make a booking

### My Appointments
![home page](./public/media/readme-images/my-appoint.png)

Each appointment will show:
* Date and time
* Dr Name
* Medical centre name
* Status which will show as either:
  * confirmed
  * completed, or
  * cancelled
* Cancel button

### Footer
The footer will have:
* **Contact**: Allow users of the site to contact Book-A-Doc
* **Terms & Conditions**: Listing all the T&C's for using the site
* **Privacy Policy**: Listing all the privacy policies on how Book-A-Doc handles user information

## Test List
* Page headings appearing in correct locations
* 
