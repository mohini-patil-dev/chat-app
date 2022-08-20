import { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import Loading from "react-fullscreen-loading";
import { useRequest } from "hooks/useRequest.hook";
import { API_PATHS } from "utils/apis";

export function VerifyEmail() {

	const [loading, setLoading] = useState<boolean>(true)
	const [searchParams] = useSearchParams();

	const [verifyEmailToken] = useRequest({
		url: API_PATHS.auth.verifyEmailToken,
		errorNavigate: '/login',
		successNavigate: '/login',
		loadingFn: setLoading,
	})

	const token = searchParams.get('token');

	useEffect(() => {
		verifyEmailToken({ params: { token } });
	}, [])


	return <Loading loading={loading} background="#fffff7" loaderColor="#3498db" />;
}