import { LoginResponse } from "../../interfaces/user-auth.interface";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { LoginRequest } from "../../interfaces/user-auth.interface";
import AxiosClient from "@/core/infrastructure/axios-client";
import { API_ROUTES } from "@/core/constants/api-routes";

export class AuthRepositoryImp implements AuthRepository {
  private httpClient: AxiosClient;

  constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  static getInstance(): AuthRepositoryImp {
    return new AuthRepositoryImp();
  }

  async signIn(request: LoginRequest): Promise<LoginResponse> {
    const { data } = await this.httpClient.post<LoginResponse>(
      API_ROUTES.AUTH.SIGNIN,
      request
    );
    
    return data.data;
  }
}
