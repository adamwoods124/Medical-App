import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import CasesList from './features/cases/CasesList'
import UsersList from './features/users/UsersList'
import PatientsList from './features/patients/PatientsList'
import EditUser from './features/users/EditUser'
import EditPatient from './features/patients/EditPatient'
import NewUserForm from './features/users/NewUserForm'
import EditCase from './features/cases/EditCase'
import NewCase from './features/cases/NewCase'
import NewPatient from './features/patients/NewPatient'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
        <Route element={<Prefetch />}>
        <Route path="dash" element={<DashLayout />}>

          <Route index element={<Welcome />} />

          <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
          <Route path="users">
            <Route index element={<UsersList />} />
            <Route path=":id" element={<EditUser />} />
            <Route path="create" element={<NewUserForm />} />
          </Route>
          </Route>

          <Route path="cases">
            <Route index element={<CasesList />} />
            <Route path=":id" element={<EditCase />} />
            <Route path="create" element={<NewCase />} />
          </Route>

          <Route path="patients">
            <Route index element={<PatientsList />} />
            <Route path=":id" element={<EditPatient />} />
            <Route path="create" element={<NewPatient />} />
          </Route>

        </Route>{/* end dash */}
      </Route>
      </Route>
      </Route>
      </Route>
    </Routes>
  );
}

export default App;
