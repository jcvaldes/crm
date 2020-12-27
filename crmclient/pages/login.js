import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client'

const AUTH_USER = gql`
  mutation authUser($input: AuthInput) {
    authUser(input: $input) {
      token
    }
  }
`
const Login = () => {
  const [message, saveMessage] = useState(null)
  const [authUser] = useMutation(AUTH_USER)

  // Routing
  const router = useRouter()

  // validar formulario
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('El Email no es válido')
        .required('El Email es obligatorio'),
      password: Yup.string()
        .required('El Password es obligatorio')
        .min(6, 'El Password debe tener al menos 6 caracteres')
    }),
    onSubmit: async (values) => {
      const { email, password } = values
      try {
        debugger
        const { data } = await authUser({
          variables: {
            input: {
              email,
              password
            }
          }
        })
        saveMessage('Autenticando...')
        // Guardar el token en localstorage
        setTimeout(() => {
          const { token } = data.authUser
          localStorage.setItem('token', token)
        }, 1000)
        // Redireccionar hacia clientes
        setTimeout(() => {
          saveMessage(null)
          router.push('/')
        }, 2000)
      } catch (error) {
        saveMessage(error.message.replace('GraphQL error: ', ''))
        // console.log(error);

        setTimeout(() => {
          saveMessage(null)
        }, 3000)
      }
    }
  })
  const showMessage = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{message}</p>
      </div>
    )
  }
  return (
    <>
      <Layout>
        {message && showMessage()}
        <h1 className="text-center text-2xl text-white font-light">Login</h1>

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                  id="email"
                  type="email"
                  placeholder="Email Usuario"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.email}</p>
                </div>
              ) : null}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                  type="password"
                  id="password"
                  placeholder="Password Usuario"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.password}</p>
                </div>
              ) : null}
              <input
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                value="Iniciar Sesión"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Login
