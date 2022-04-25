import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useLocation } from 'react-router'

export default function RequireAuth ( {children }) {
    const { loginWithRedirect, isAuthenticated } = useAuth0()
    const location = useLocation()

    return isAuthenticated === true
        ? children
        : loginWithRedirect({
            appState:{
                returnTo: window.location.pathname
            }
        })
}

/* For react-router versions less than 6
const ProtectedRoute = ({ component, ...args}) => (
    <Route component={withAuthenticationRequired(component)} {...args} />
)

export default ProtectedRoute
*/