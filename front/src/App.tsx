// Library CSS
import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap
import 'react-toastify/dist/ReactToastify.css'; // Toastify

import 'css/app.css'


import { Toast } from 'components/layouts/Toast';
import { AppRoutes } from 'pages/routes'

export function App() {

	return (
		<>
			<Toast />
			<AppRoutes />
		</>
	)
}