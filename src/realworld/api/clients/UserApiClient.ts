import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../../base/base-api-client';

type LoginPayload = { email: string; password: string };
type RegisterPayload = { email: string; username: string; password: string };
type UpdateUserPayload = { email?: string; username?: string; password?: string; bio?: string; image?: string };

export class UserApiClient extends BaseApiClient {
    constructor(request: APIRequestContext, token: string | null = null) {
        super(request, token);
    }

    login(email: string, password: string) {
        const body: { user: LoginPayload } = { user: { email, password } };
        return this.request.post('/users/login', { data: body });
    }

    register(email: string, username: string, password: string) {
        const body: { user: RegisterPayload } = { user: { email, username, password } };
        return this.request.post('/users', { data: body });
    }

    getCurrentUser() {
        return this.request.get('/user', { headers: this.authHeaders() });
    }

    updateUser(payload: UpdateUserPayload) {
        return this.request.put('/user', { data: { user: payload }, headers: this.authHeaders() });
    }
}
