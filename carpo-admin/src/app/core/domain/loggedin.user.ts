export class LoggedInUser {
  constructor(id: string, access_token: string, username: string, fullname: string, email: string, photo: string, role: any, permissions: any
  ) {
    this.access_token = access_token;
    this.fullname = fullname;
    this.username = username;
    this.email = email;
    this.photo = photo;
    this.role = role;
    this.permissions = permissions;
    this.id = id;
  }
  public id: string;
  public access_token: string;
  public username: string;
  public fullname: string;
  public email: string;
  public photo: string;
  public permissions: any;
  public role: any;
}
