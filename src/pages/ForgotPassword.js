import {useState} from 'react';
import {Link} from 'react-router-dom';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import {toast} from 'react-toastify';
import {ReactComponent as ArrorRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg';


function ForgotPassword(){
    const [email, setEmail] = useState('');
    const onChange = (e)=>{
        setEmail(e.target.value)
    };
    const onSubmit = async(e)=>{
        e.preventDefault();
        try{
            const auth = getAuth();
            await sendPasswordResetEmail(auth,email);
            toast.success("Email sent");
        }catch(error){
            toast.error('Could not send reset email');
        }
    }

    return(
        <div className='forgotPasswordContainer'>
        <div className='pageConatiner'>
            <header>
                <p className='pageHeader'>Forgot Password</p>
            </header>
            <main>
                <form onSubmit={onSubmit}>
                    <input className='emailInput' type='email'
                    placeholder='Email' id='email' value={email}
                    onChange={onChange}></input>
                    <Link className='forgotPasswordLink' to='/sign-in'>Sign In</Link>
                    <div className='signInBar'>
                        <div className='signInText'>Send Reset Link</div>
                        <button className='signInButton'>
                            <ArrorRightIcon fill='white' width='34px' height='34px' />
                        </button>
                    </div>


                </form>
            </main>
        </div>
        </div>
    );
}
export default ForgotPassword;