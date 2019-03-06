/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.firstname = null;
    this.lastname = null;
    this.birthdate = null;
    this.username = null;
    this.password = null;
    this.token = null;
    this.status = null;
    this.games = null;
    this.moves = null;
    Object.assign(this, data);
  }
}
export default User;
