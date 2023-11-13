import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import CasesList from './features/cases/CasesList'
import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'
import EditCase from './features/cases/EditCase'
import NewCase from './features/cases/NewCase'
import Prefetch from './features/auth/Prefetch'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route element={<Prefetch />}>
        <Route path="dash" element={<DashLayout />}>

          <Route index element={<Welcome />} />

          

          <Route path="users">
            <Route index element={<UsersList />} />
            <Route path=":id" element={<EditUser />} />
            <Route path="create" element={<NewUserForm />} />
          </Route>

          <Route path="cases">
            <Route index element={<CasesList />} />
            <Route path=":id" element={<EditCase />} />
            <Route path="create" element={<NewCase />} />
          </Route>

        </Route>{/* end dash */}
      </Route>
      </Route>
    </Routes>
  );
}

export default App;
