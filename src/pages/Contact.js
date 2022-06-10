import {useState, useEffect} from 'react';
import {useParams,useSearchParams } from 'react-router-dom';
import {doc, getDoc} from 'firebase/firestore';
import {db} from '../Fibebase.config';
import {toast} from 'react-toastify';

const Contact = ()=>{
   const [message, setMessage] = useState('');
   const [landlord, setLandlord] = useState(null);
   const [searchParams, setSearchParams] = useSearchParams();

   const params =useParams();

   useEffect(()=>{
      const getLandlord = async()=>{
         const docRef = doc(db,'users', params.landlordId);
         const docSnap = await getDoc(docRef);
         if(docSnap.exists()){
            setLandlord(docSnap.data());
         }else{
            toast.error('Could not get landlord data');
         }
      }
      getLandlord();
   },[params.landlordId])
   const messageChangeHandler = e =>{
      setMessage(e.target.value)
   }
   const messageSent = ()=>{
      toast.success('Message sent')
      setMessage('')
   }
   return(
      <div className='pageContainer'>
         <header className='pageHeader'>
            Contact Landlord
         </header>
         {landlord!==null ? 
         <main>
            <div className='contactLandlord'>
               <p className='landlordName'>Contact:<i> {landlord?.name}</i></p>
            </div>
            <form className='messageForm'>
               <div className='messageDiv'>
                  <label className='messageLabel' htmlFor='message'>Message</label>
                  <textarea name='message' id='message' 
                  className='textarea' value={message} 
                  onChange={messageChangeHandler}></textarea>
               </div>
               <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
               <button className='primaryButton' type='button' onClick={messageSent}>
                  Send Message
               </button></a>
               
            </form>
         </main>   
      :<></>}
      </div>
   );
}

export default Contact;