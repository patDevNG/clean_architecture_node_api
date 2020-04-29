export default class LoginUsecase{
  
    async auth(email, password){
        return{
            email,
            password
        }
    }
}