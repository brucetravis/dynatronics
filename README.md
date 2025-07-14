const names = [ "john Stewart", "john Doe", "maggie harlem"]
const convertedNames = names.map((name) => name.split("").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(""))
console.log(convertedNames)

# .join method 
It creates a string from an array
It concatenates all the characters from an array to form a string
So for all elements even integers, It first converts them into a string before converting the whole array into a string

SYNTAX
array.join(separator) // what you want to separate the elements with
The default separator is a comma, unless you specify otherwise

# Example
const numbers = [1, 2, 3, 4, 5, 6]

const numbersJoin = numbers.join()
console.log(numbersJoin)

# Output
1, 2, 3, 4, 5

const fruits = ["banana", "mango", 45, "orange"]
console.log(fruits)

banana, mango, 45, orange

# createUserWithEmailAndPassword
Used to create a user with firebases auth which 
will return UserCredential which contains the user property which contains uid, name, email, displayName etc


# When updating the user profile using updateProfile(), you can only update the displayName and the picture
await updateProfile(cred.user, { displayName: inputValue.name })

# For the email you will use updateEmail() and for the password you will use updatePassword()


# reload() tells Firebase:
“Hey, extract/retrieve all the latest value of this user storesd in auth.currentuser or auth.user.

// Access the saved displayName value from firebase and atore It in the user object 
# await cred.user.reload()  // reload does not reload the web page but accesses the user object values after a name has been saved to dsplayName 

#?.
# ✅ ?. is called the optional chaining operator.
It helps you safely access properties of an object that might be null or undefined.

# 🔥 Real-life example:
const user = null;
console.log(user.name); // ❌ Error! Can't read 'name' of null

But if you use:
console.log(user?.name); // ✅ No error, just prints: undefined

With a plain dot (.)

JavaScript tries to dive straight in.

If the thing on the left is null or undefined → it crashes with “Cannot read property …”.

With ?. (optional chaining)

JavaScript first checks: “Is the left side real (truthy)?”

Yes → keep going and read the next property.

No → stop right there and return undefined (no crash).

So obj?.prop is a safe way to say:

“Give me obj.prop if obj exists; otherwise just give me undefined.”


ooh so with '.', JavaScript just dives right in without checking If It has a value, It's like 'sure I know there is a value there', but with  ?. JavaScript is cautious in checking, 'is there a value there, If there is, return the right side' If not return the null

#  optional chaining prevents those annoying “cannot read property” crashes.



# COOKIES
- There are two options npm install react-cookie-consent
 and npm install js-cookie

// App.jsx or Layout.jsx
import CookieConsent from "react-cookie-consent";
import "./CookieBanner.css"; // styling below


# npm install react-cookie-consent
<CookieConsent
    location='bottom' // show the banner at the bottom of the screen. Another chice is top
    buttonText='Accept' // Text that appears on the main confirmation button
    declineButtonText="reject" // Text that appears on the reject cookies button
    enableDeclineButton // truns the decinie button on, without this prop, ony the Accept button is rendered
    cookieName='dynaTronicsConsent' // Name of the cookie the library saves. You need this cookie later to know their choice
    expires={20} // How long in days, the cookies remain valid, after that the banner appears again the number of days
    overlay // Adds a semi transparent dark overlay behind the banner dimmming the page tp draw attention
    containerClasses='cookie-banner' // custom css class to style the banner
    buttonClasses='cookie-btn accept' // css class applied to the accept button for styling
    declineButtonClasses='cookie-btn decline' // Css class applied to the decline button for styling
>
    We use cookies to personalize your experience &amp; analyze traffic
    <a href='/privacy' className='policy-link' target='_blank'>
        Learn More
    </a>
</CookieConsent>


# npm install js-cookie
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./CookieCard.css";

export default function CookieCard() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!Cookies.get("dynatechConsent")) setShow(true);
  }, []);

  const accept = () => {
    Cookies.set("dynatechConsent", "true", { expires: 365 });
    setShow(false);
  };

  const decline = () => {
    Cookies.set("dynatechConsent", "false", { expires: 365 });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie-card">
      <p>
        We use cookies to personalize your experience &amp; analyse traffic.
        <a href="/privacy-policy" className="link"> Learn more</a>
      </p>
      <div className="btn-row">
        <button onClick={accept}  className="btn accept">Accept</button>
        <button onClick={decline} className="btn decline">Decline</button>
      </div>
    </div>
  );
}

# FIRESTORE

# Terms
- SnapShot - a snapshot is a picture of a specific document at a certain specific time (i.e As of now)
- It doesn't keep updating — it's just a frozen view of how things looked when you requested it.

✅ What’s Inside a Snapshot?
A snapshot (like querySnapshot) has:

.docs: an array of all documents in the collection

.size: how many docs were found

.empty: whether the collection was empty or not

Each doc inside .docs is also a snapshot — a DocumentSnapshot with:

doc.id: the document’s ID

doc.data(): the actual data (like name, price, imageUrl)

📦 Analogy Time:
Imagine Firestore is a big warehouse.

You go inside and take a 📸 photo of Shelf A (Products).

That photo is your snapshot.

You can now look at all the items (docs) in that photo — but if someone adds or removes products after you took the picture, you won’t see it unless you take a new snapshot.



🔍 Here’s what’s really happening:
When you do:

js
Copy code
const querySnapshot = await getDocs(collection(db, 'Products'))
You're getting a QuerySnapshot object — this object has:

querySnapshot.size → number of documents

querySnapshot.empty → true or false

querySnapshot.docs → ✅ this is the actual array of product documents

⚠️ So if you try this:
js
Copy code
querySnapshot.map(...)
❌ It will throw an error like:

querySnapshot.map is not a function

Because querySnapshot is not an array.
It's an object that contains the array.

✅ But this works:
js
Copy code
querySnapshot.docs.map(...)
Because .docs is an array of document snapshots (each one representing a product).

🔐 Think of it like this:
Thing	What it is
querySnapshot	A folder with extra info
querySnapshot.docs	The array of actual items
.map()	Only works on arrays

✅ TL;DR:
You use .docs.map(...) because querySnapshot is not an array — it's a wrapper that contains an array (.docs) and some metadata like .empty, .size.



