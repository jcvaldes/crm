import React, {useState} from 'react'
import Layout from '../components/Layout'
import {useRouter} from 'next/router'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client'

const NEW_USER = gql`
  mutation newUser($input: UserInput) {
    newUser(input: $input) {
      id
      name
      lastname
      email
    }
}
`
const Register = () => {
  const [message, saveMessage] = useState(null)
  const [ newUser ] = useMutation(NEW_USER)

  // Routing
  const router = useRouter()
  // validar formulario
  const formik = useFormik({
    initialValues: {
      name: '',
      lastname: '',
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('El Nombre es obligatorio'),
      lastname: Yup.string().required('El Apellido es obligatorio'),
      email: Yup.string()
        .email('El Email no es válido')
        .required('El Email es obligatorio'),
      password: Yup.string()
        .required('El Password es obligatorio')
        .min(6, 'El Password debe tener al menos 6 caracteres')
    }),
    onSubmit: async (values) => {
      const { name, lastname, email, password } = values
      
      try {
        const { data }  = await newUser({
          "variables": {
            "input": { name, lastname, email, password }
          }
        })
        // usuario creado correctamente
        saveMessage(`Se creo correctamente el usuario: ${data.newUser.name}`)
        setTimeout(() => {
          saveMessage(null)
          // redirigir al usuario para iniciar sersion
          router.push('/login')          
        }, 3000)
      } catch ( err ) {
        saveMessage(err.message.replace('GraphQL error: ', ''))
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
        {message && showMessage() }
        <h1 className="text-center text-2xl text-white font-light">
          Crear Nueva Cuenta
        </h1>

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Nombre
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                  id="name"
                  type="text"
                  placeholder="Nombre"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.name && formik.errors.name ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.name}</p>
                </div>
              ) : null}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="lastname"
                >
                  Apellido
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                  id="lastname"
                  type="text"
                  placeholder="Apellido"
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.lastname && formik.errors.lastname ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.lastname}</p>
                </div>
              ) : null}
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
                  placeholder="Email"
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
                  placeholder="Password"
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
                value="Crear Cuenta"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Register
