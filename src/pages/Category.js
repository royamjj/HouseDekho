import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {collection, getDocs,query,where, orderBy, limit, startAfter} from 'firebase/firestore';
import {db} from '../Fibebase.config';
import {toast} from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

const Category = ()=>{

   const [listings, setListings] = useState(null);
   const [loading, setLoading] = useState(true);
   const params = useParams();
   
   useEffect(()=>{
      const fetchListings = async()=>{
         try{
            const lisitingsRef = collection(db,'listings');
            const q = query(lisitingsRef, 
               where('type','==',params.categoryName),
               orderBy('timestamp','desc'),
               limit(10));
            const querySnap = await getDocs(q);

            let lists = [];
            querySnap.forEach((doc)=>{
               lists.push({
                  id: doc.id,
                  data:doc.data(),
               })
            })
            setListings(lists);
            setLoading(false);
         }catch(error){
            toast.error("Cannot get listings at the moment!")
         }
      }
      fetchListings();
      //eslint-disable-next-line react-hooks/exhaustive-deps
   },[]);

   return(
      <div className='category'>
         <header>
            <p className='pageHeader'>
               {params.categoryName==='rent' ? 'Places for rent': 'Places for sale'}
            </p>
         </header>
         {loading ? <Spinner/> : listings && listings.length > 0 ? 
         <main>
            <ul className='categoryListings'>
               {listings.map(list =>
               // {console.log(list.data)}
                  <ListingItem key={list.id} listing={list.data} id={list.id} />
               )}
            </ul>
         </main> 
         : <p>No listings for {params.categoryName}</p>}
      </div>
   );
}
export default Category;