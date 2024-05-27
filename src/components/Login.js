import { faChevronLeft, faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useState } from "react"
import { loginApi } from "../services/UserService"
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const Login = () => {
    const navigate = useNavigate()
    const { loginContext } = useContext(UserContext)


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isShowPass, setIsShowPass] = useState(false)

    const [loadingAPI, setLoadingAPI] = useState(false)

    const handleLogin = async () => {
        if(!email || !password) {
            toast.error("Email or Password is required")
            return
        }
        setLoadingAPI(true)
        let res = await loginApi(email.trim(), password)
        if(res && res.token) {
            loginContext(email, res.token)
            navigate("/")
        } else {
            if(res && res.status === 400) {
                toast.error(res.data.error)
            }
        }
        setLoadingAPI(false)
    }

    const handeGoback = () => {
        navigate("/")
    }

    const handlePressEnter = (event) => {
        if(event.key === "Enter") {
            handleLogin()
        }
    }

    return (
        <>
            <div className="login-container col-12 col-sm-4">
                <div className="title">Log in</div>
                <div className="text">Email or username ( eve.holt@reqres.in )</div>

                <input 
                    type="text" 
                    placeholder="Email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="input-pass">
                    <input 
                        type={isShowPass === true ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => handlePressEnter(e)}
                    />
                    <FontAwesomeIcon
                        icon={isShowPass === true ? faEye : faEyeSlash} className="icon"
                        onClick={() => setIsShowPass(!isShowPass)}
                     
                    />
                </div>

                <button
                    className={email && password ? "active" : ""}
                    disabled={email && password ? false : true}
                    onClick={() => handleLogin()}
                >
                    {loadingAPI && <FontAwesomeIcon icon={faSpinner} className="me-2"/>}
                    Login
                </button>
                <div className="back">
                    <FontAwesomeIcon icon={faChevronLeft} className="me-2"/>
                    <span onClick={() => handeGoback()}>Go back</span>
                </div>
            </div>
        </>
    )
}

export default Login