import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'; 
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {toast} from 'react-toastify';
import OAuth from '../components/OAuth';

function SignIn(){

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email:"",
        password:"",
    });
    const {email, password} = formData;

    const navigate = useNavigate();

    function onChangeHandler(e){
        setFormData({...formData, [e.target.id]:e.target.value})
    }

    const onSubmitHandler = async (e)=>{
        e.preventDefault();
        try{
            const auth = getAuth();
            const userCredentials = await signInWithEmailAndPassword(auth,email,password);
            if(userCredentials.user){
                navigate('/')
            };
        }catch(e){
            toast.error('Bad user credentials!')
        }
    }

    return(
        <div className='pageContainer'>
            <header>
                <p className='pageHeader'>Welcome back!</p>
            </header>
            <form onSubmit={onSubmitHandler}>
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
                <div className='signInBar'>
                    <p className='signInText'>Sign In</p>
                    <button className='signInButton'>
                        <ArrowRightIcon fill='white' width='34px' height='34px'/>
                    </button>
                </div>
            </form>
            <OAuth/>
            <Link to='/sign-up' className='registerLink' >Sign up instead</Link>
        </div>
    );
}
export default SignIn;