import { useState, useEffect } from "react";
import { Link, useMavigate, useNavigate, useParams } from "react-router-dom";
import {getDoc, doc} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {db} from '../Fibebase.config';
import Spinner from "../components/Spinner";
import shareIcon from '../assets/svg/shareIcon.svg';
import { toast } from "react-toastify";
import {MapContainer, Popup, Marker, TileLayer} from 'react-leaflet'
import SwiperCore , {Navigation, Pagination, Scrollbar, A11y} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

var formatter = new Intl.NumberFormat('en-US', {
   style: 'currency',
   currency: 'USD',
 });
const Listing=()=>{
   const [listing, setListing] = useState(null);
   const [loading, setLoadin] = useState(true);
   const [shareLinkCopied, setShareLinkCopied] = useState(false);
   const navigator = useNavigate();
   const auth = getAuth();
   const params = useParams();

   useEffect(()=>{
      const fetchListing = async()=>{
         const docRef = doc(db,'listings', params.listingId);
         const docSnap = await getDoc(docRef);
         if(docSnap.exists()){
            setListing(docSnap.data());
            setLoadin(false);
         }
      }
      fetchListing();
   },[navigator, params.listingId]);
   if(loading){
      return(<Spinner/>)
   }
   return(
      <main>
         <Swiper slidesPerView={1} pagination={true} modules={[Pagination]} className='mySwiper'>
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <img className="swiperSlideDiv" src={url}/>
          </SwiperSlide>
        ))}
      </Swiper>
         <div className="shareIconDiv" onClick={()=>{
            if(navigator.clipboard){
               navigator.clipboard.writeText(window.location.href);
               toast.success('Link copied')
            }
            else{
               toast.error('Not copied, please copy manually :(')
            }
            setShareLinkCopied(true);
            setTimeout(()=>{
               setShareLinkCopied(false);
            },2000);
         }}>
            <img src={shareIcon} alt='share'/>
         </div>
         <div className="listingDetails">
            <p className="listingName">
               {listing.name} - {listing.offer ? 
               formatter.format(listing.discountedPrice) : 
               formatter.format(listing.regularPrice)}
            </p>
            <p className="listingLocation">{listing.location}</p>
            <p className="listingType">
               For {listing.type ? 'rent' : 'sale'}
            </p>
            {listing.offer ? 
            <p className="discountPrice">${listing.regularPrice-listing.discountedPrice}</p>
            :<></>}
            <ul className="listingDetailsList">
               <li>
                  {listing.bedrooms > 1 ? `${listing.bedrooms} bedrooms` : '1 bedroom'}
               </li>
               <li>
                  {listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : '1 bathroom'}
               </li>
               <li>{listing.parking ? 'Parking available' : 'No parking'}</li>
               <li>{listing.furnished ? 'Furnished' : 'Not furnished'}</li>
            </ul>
            <p className="listingLocationTitle">Location</p>
               <div className="leafletContainer">
                  <MapContainer style={{height:'100%', width:'100%'}} center={[
                     listing.geolocation.lat, listing.geolocation.lng
                     ]} zoom={13} scrollWheelZoom={false}>
                     <TileLayer 
                     attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                     url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png' 
                     />
                     <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
                        <Popup>{listing.location}</Popup>
                     </Marker>
                  </MapContainer>
               </div>

            {auth.currentUser?.uid!==listing.userRef ? 
            <Link 
            to={`/contact/${listing.userRef}?listingName=${listing.name}`} 
            className="primaryButton">Contact LandLord</Link>
            :<></>}
         </div>
      </main>
   );
}
export default Listing;