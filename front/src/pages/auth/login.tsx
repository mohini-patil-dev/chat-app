import { ChangeEvent, FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import 'pages/auth/css/auth.css'

import { Spinner } from 'react-bootstrap'
import { emptyState } from 'helpers/state.helper'
import { LOCAL_STORAGE_KEYS } from 'utils/constants'
import { API_PATHS } from 'utils/apis';
import { setUser } from 'store/actions/auth/auth.actions'
import { useAppDispatch } from 'store/helpers'
import { useRequest } from 'hooks/useRequest.hook'

interface ILoginData {
  email: string
  password: string
}

export function Login() {
  const dispatch = useAppDispatch();

  const [loginData, setLoginData] = useState<ILoginData>({
    email: '',
    password: ''
  })
  const [apiLoading, setApiLoading] = useState<boolean>(false)

  const [makeLoginRequest] = useRequest({
    url: API_PATHS.auth.login,
    method: 'post',
    successNavigate: '/',
    onSuccess: handleSuccessLogin,
    loadingFn: setApiLoading,
  })


  function handleLoginFormInput(name: string) {
    return function (event: ChangeEvent<HTMLInputElement>) {
      setLoginData({
        ...loginData,
        [name]: event?.target?.value
      })
    }
  }

  function handleSuccessLogin(data: any) {
    if (!data) return
    dispatch(setUser(data.data.user))
    setLoginData(emptyState<ILoginData>(loginData))
    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, data.data.token)
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await makeLoginRequest({
      data: loginData,
    })
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleLoginSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="text-center">
            Not registered yet?{" "}
            <Link to='/register' className="link-primary">
              Register
            </Link>
          </div>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Enter email"
              value={loginData.email}
              onChange={handleLoginFormInput('email')}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={loginData.password}
              onChange={handleLoginFormInput('password')}
              required
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary" disabled={apiLoading}>
              {
                apiLoading ? (
                  <Spinner animation='grow' />
                ) : 'Login'
              }
            </button>
          </div>
          <p className="text-center mt-2">
            <a href="#">
              Forgot Password?
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}