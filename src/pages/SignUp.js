import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'; 
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import {getAuth, createUserWithEmailAndPassword,updateProfile} from 'firebase/auth';
import {db} from '../Fibebase.config';
import {setDoc, doc, serverTimestamp} from 'firebase/firestore';
import {toast} from 'react-toastify';
import OAuth from '../components/OAuth';

function SignUp(){

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email:"",
        password:"",
        name:"",
    });
    const {name, email, password} = formData;

    const navigate = useNavigate();

    function onChangeHandler(e){
        setFormData({...formData, [e.target.id]:e.target.value})
    }

    const onSubmitHandler = async(e) =>{
        e.preventDefault();
        if(email.search('@')===-1){
            toast.error("Enter valid email!");
        }
        else{
            try{
                const auth = getAuth();
                const userCredentials = await createUserWithEmailAndPassword(auth,email,password);
                const user = userCredentials.user;
                updateProfile(auth.currentUser, {
                    displayName:name,
                })
    
                //adding user to db
                const formDataCopy =  formData;
                delete formDataCopy.password;
                formDataCopy.timestamp = serverTimestamp();
                
                await setDoc(doc(db,'users',user.uid), formDataCopy);
                navigate('/');
    
            }catch(e){
                toast.error(e.message);
            }
        }

    }

    return(
        <div className='pageContainer'>
            <header>
                <p className='pageHeader'>Welcome back!</p>
            </header>
            <form onSubmit={onSubmitHandler} id='signup'>
                <input type="text" placeholder='Name' id='name'
                className='nameInput' value={name} onChange={onChangeHandler}></input>
                <input type="email" placeholder='email' id='email'
                className='emailInput' value={email} onChange={onChangeHandler}></input>
                <div className='passwordInputDiv'>
                    <input type={showPassword ? 'text' : 'password'} 
                    className='passwordInput' placeholder='Password' 
                    id='password' value={password} onChange={onChangeHandler}></input>
                    <img src={visibilityIcon} alt='show password' 
                    className='showPassword'  onClick={()=>setShowPassword((state)=>!state)}/>
                </div>
                <Link to='/forgot-password' className='forgotPasswordLink'>Forgot Password?</Link>
                <div className='signUpBar'>
                    <p className='signUpText'>Sign Up</p>
                    <button className='signInButton' type='submit' form='signup'>
                        <ArrowRightIcon fill='white' width='34px' height='34px'/>
                    </button>
                </div>
            </form>
            <OAuth/>
            <Link to='/sign-in' className='registerLink' >Sign In instead</Link>
        </div>
    );
}
export default SignUp;