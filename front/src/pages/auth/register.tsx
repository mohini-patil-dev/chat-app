import { ChangeEvent, FormEvent, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import 'pages/auth/css/auth.css'

import { emptyState } from 'helpers/state.helper'
import { ShowToast } from 'helpers/toast.helper'
import { API_PATHS } from 'utils/apis'
import { useRequest } from 'hooks/useRequest.hook'


interface IRegisterData {
  name: string,
  email: string,
  username: string,
  password: string,
  confirmPassword: string,
}

export function Register() {

  const [registerData, setRegisterData] = useState<IRegisterData>({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [apiLoading, setApiLoading] = useState<boolean>(false)

  const [registerUser] = useRequest({
    url: API_PATHS.auth.register,
    method: 'post',
    loadingFn: setApiLoading,
    successNavigate: '/login',
    onSuccess: onRegisterSuccess
  })

  function onRegisterSuccess(data: any) {
    if (!data) return
    setRegisterData(emptyState<IRegisterData>(registerData))
  }


  function handleLoginFormInput(name: string) {
    return function (event: ChangeEvent<HTMLInputElement>) {
      setRegisterData({
        ...registerData,
        [name]: event?.target?.value
      })
    }
  }

  async function handleRegisterFormInput(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (registerData.password !== registerData.confirmPassword) {
      return new ShowToast('error').show('Passwords & Confirm password do not match')
    }

    registerUser({
      data: registerData,
    })

  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleRegisterFormInput}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Register</h3>
          <div className="text-center">
            Already registered?{" "}
            <Link to="/login" className="link-primary" >
              Login
            </Link>
          </div>
          <div className="form-group mt-3">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="e.g Jane Doe"
              onChange={handleLoginFormInput('name')}
            />
          </div>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              type="text"
              value={registerData.username}
              className="form-control mt-1"
              placeholder="e.g. superman"
              onChange={handleLoginFormInput('username')}
            />
          </div>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Email Address"
              value={registerData.email}
              onChange={handleLoginFormInput('email')}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Password"
              value={registerData.password}
              onChange={handleLoginFormInput('password')}
            />
          </div>
          <div className="form-group mt-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Password"
              value={registerData.confirmPassword}
              onChange={handleLoginFormInput('confirmPassword')}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary" disabled={apiLoading}>
              {
                apiLoading ? (
                  <Spinner animation='grow' />
                ) : 'Register'
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}