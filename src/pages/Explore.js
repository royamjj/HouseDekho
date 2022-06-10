import {Link} from 'react-router-dom';
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';
import Slider from '../components/Slider';

function Explore(){
    return(
        <div className='explore'>
            <header>
                <p className='pageHeader'>Explore</p>
            </header>
            <Slider/>
            <main>
                <p className='exploreCategoryHeading'>Categories</p>
                <div className='exploreCategories'>
                    <div className='categoryContainer'>
                        <Link to='/category/rent'>
                        <img src={rentCategoryImage} 
                        className='exploreCategoryImg' alt='rent'/>
                        </Link>
                        <p className='exploreCategoryName'>Places for rent</p>
                    </div>
                    <div className='categoryContainer'>
                        <Link to='/category/sale'>
                        <img src={sellCategoryImage} 
                        className='exploreCategoryImg' alt='sale'/>
                        </Link>
                        <p className='exploreCategoryName'>Places for sale</p>
                    </div>
                    
                </div>
            </main>
        </div>
    );
}
export default Explore;