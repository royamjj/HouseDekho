import {getAuth, updateProfile} from 'firebase/auth';
import {useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {updateDoc, doc, getDocs,query, where, orderBy,deleteDoc, collection} from 'firebase/firestore';
import {db} from '../Fibebase.config';
import {toast} from 'react-toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import ListingItem from '../components/ListingItem';

function Profile(){
    const auth = getAuth();
    const [formData, setFormData] = useState({
        name:auth.currentUser.displayName,
        email:auth.currentUser.email,
    });
    const [listings, setListings] = useState(null);
    const [loading,setLoading]=useState(true);

    useEffect(() => {
        const fetchUserListings = async () => {
          const listingsRef = collection(db, 'listings');
          const q = query(
            listingsRef,
            where('userRef', '==', auth.currentUser.uid),
            orderBy('timestamp', 'desc')
          );
          const querySnap = await getDocs(q);
          let listings = [];
          querySnap.forEach((doc) => {
            return listings.push({
              id: doc.id,
              data: doc.data(),
            })
          });
    
          setListings(listings);
          setLoading(false);
        }
        fetchUserListings();
    },[auth.currentUser.uid]);


    const {name} = formData;
    const [changeDetails, setChangeDetails] = useState(false);
    const navigate = useNavigate();

    function onLogout(){
        auth.signOut();
        navigate('/');
    }

    const onDeleteHandler = async (listingId) => {
        if (window.confirm('Are you sure you want to delete?')) {
          await deleteDoc(doc(db, 'listings', listingId))
          const updatedListings = listings.filter(
            (listing) => listing.id !== listingId
          )
          setListings(updatedListings)
          toast.success('Successfully deleted listing')
        }
      }

    const onEditHandler = (id)=>{
        navigate(`/edit-listing/${id}`);
    }
    const onSubmit = async()=>{
        try{
            if(auth.currentUser.displayName !== name){
                updateProfile(auth.currentUser,{
                    displayName:name
                })
            }
            const userRef = doc(db,'users',auth.currentUser.uid)
            await updateDoc(userRef, {
                name
            })
        }catch(error){
            toast.error('Could not update details!');
        }
    }
    function changeHandler(e){
        setFormData({...formData, [e.target.id]:e.target.value});
    }

    return (
        <div className='profile'>
            <header className='profileHeader'>
                <p className='pageHeader'>My Profile</p>
                    <button type='button' 
                    className='logOut'
                    onClick={onLogout}>
                        Logout
                    </button>
            </header>
            <main>
                <div className='profileDetailsHeader'>
                    <p className='profileDetailsText'>Personal Details</p>
                    <p className='changePersonalDetails' onClick={()=>{
                        changeDetails && onSubmit()
                        setChangeDetails(!changeDetails);
                    }}>
                        {changeDetails ? 'Done' : 'Change'}
                    </p>
                </div>
                <div className='profileCard'>
                    <form>
                        <input type='text' id='name' 
                        className={!changeDetails ? 'profileName' : 'profileNameActive'}
                        disabled={!changeDetails}
                        value={name}
                        onChange={changeHandler}></input>
                    </form>
                </div>
                <Link to='/create-listing' className="createListing">
                    <img src={homeIcon}alt='home' />    
                    <p>Sell or rent your paradise</p>
                    <img src={arrowRight} alt='arrow' />
                </Link>

                {!loading && listings?.length > 0 ?
                <>
                    <p className='listingText'>Your listings</p>
                    <ul className='listingsList'>
                        {listings.map(list =>
                            <ListingItem key={list.id} 
                            id={list.id} 
                            listing={list.data}
                            onDelete={onDeleteHandler}
                            onEdit ={onEditHandler}/>
                        )}
                    </ul>
                </>
                :<></>}
            </main>
        </div>
    );
}
export default Profile;