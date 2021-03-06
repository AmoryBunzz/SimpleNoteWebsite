import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from 'components/layouts/MainLayout'
import loadableComponent from 'components/loadable-component'
import AuthenticatedRoute from './authenticated-route'
import GuestRoute from './guest-route'

const Login = loadableComponent(() => import('views/pages/login'))
const Register = loadableComponent(() => import('views/pages/register'))
const Profile = loadableComponent(() => import('views/pages/profile'))
const EditProfile = loadableComponent(() =>
    import('views/pages/profile/edit-profile'),
)
const ChangePassword = loadableComponent(() =>
    import('views/pages/change-password'),
)
const NotFound = loadableComponent(() => import('views/pages/404-not-found'))
const TopPage = loadableComponent(() => import('views/pages/top-page'))
const CreateNote = loadableComponent(() => import('views/pages/create-note'))
const AddCategory = loadableComponent(() => import('views/pages/top-page/add'))

const availableRoles = [1, 2]

function AllRoutes() {
    return (
        <Routes>
            <Route element={<GuestRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>
            <Route
                element={<AuthenticatedRoute acceptedRoles={availableRoles} />}
            >
                <Route
                    path="/change-password"
                    element={<MainLayout component={ChangePassword} />}
                />
                <Route
                    path="/profile"
                    element={<MainLayout component={Profile} />}
                />
                <Route
                    path="/profile/edit"
                    element={<MainLayout component={EditProfile} />}
                />
                <Route
                    path="/top-page"
                    element={<MainLayout component={TopPage} />}
                />
                <Route
                    path="/notes/add"
                    element={<MainLayout component={CreateNote} />}
                />
                <Route
                    path="/categories/add"
                    element={<MainLayout component={AddCategory} />}
                />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
export default AllRoutes
