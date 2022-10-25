export class User {
    _id?: string;
    name: string;
    role: string;
    avatar: string;
    designation: string;
    email: string;
    phone: string;
    password: string;
    otp: string;
    token: string;
    isActive: boolean;
    /**
     * Constructor
     *
     * @param user
     */
    constructor(user) {
        {
            this._id = user._id;
            this.name = user.name || '';
            this.role = user.role || '';
            this.avatar = user.avatar || 'assets/images/avatars/profile.jpg';
            this.designation = user.designation || '';
            this.email = user.email || '';
            this.phone = user.phone || '';
            this.password = user.password || '';
            this.otp = user.otp || '';
            this.token = user.token || '';
            this.isActive = user.isActive;
        }
    }
}
