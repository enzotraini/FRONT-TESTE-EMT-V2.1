import { Outlet } from 'react-router-dom'
import { AppLayout } from './pages/_layouts/AppLayout'
import { isAuthenticated } from './routes'

export default function App() {
	const isAuth = isAuthenticated()

	return isAuth ? (
		<AppLayout>
			<Outlet />
		</AppLayout>
	) : (
		<Outlet />
	)
}
