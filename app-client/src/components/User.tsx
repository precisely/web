import * as React from 'react';

// tslint:disable-next-line
export const User = (props: {user: any}): JSX.Element => {
    const {user} = props;

    return (
        <div style={wrapper}>
            <div style={container}>
                <div style={userContainer}>
                    <h4>
                        {user.name} <span>@{user.screen_name}</span>
                    </h4>
                    <p>
                        <i className="material-icons">location_on</i>
                        {user.location}
                    </p>
                    <p>{user.description}</p>
                </div>
            </div>

            <div style={container}>
                <div style={numberWrapper}>
                    <div className="column">
                        <div className="title">Tweets</div>
                        <div className="number">{user.posts.length}</div>
                    </div>
                    <div className="column">
                        <div className="title">Followers</div>
                        <div className="number">{user.followers_count}</div>
                    </div>
                    <div className="column">
                        <div className="title">Likes</div>
                        <div className="number">{user.favourites_count}</div>
                    </div>
                    <div className="column">
                        <div className="title">Friends</div>
                        <div className="number">{user.friends_count}</div>
                    </div>
                </div>
            </div>

            <div style={container}>
                {user.posts.map((name: {tweet: string}, index: number): JSX.Element => (
                    <div style={tweet} key={index}>{name.tweet}</div>
                ))}
            </div>
        </div>
    );
}

export default User;

const wrapper = {
    marginTop: '30px',
    marginBottom: '30px',
}

const container = {
    margin: 'auto',
    width: '600px',
    maxWidth: '100%',
    textAlign: 'left',
    backgroundColor: '#ffffff',
    borderRadius: '2px',
    boxShadow: '0px 1px 1px 0 rgba(0, 0, 0, 0.3)',
}

const userContainer = {
    marginBottom: '30px',
    padding: '15px 15px',
    textAlign: 'center',
};

const numberWrapper = {
    display: 'flex',
    marginTop: '30px',
    marginBottom: '30px',
}

const tweet = {
    borderBottom: '1px solid #e6ecf0',
    padding: '15px 15px',
    fontSize: '14px',
    lineHeight: '20px',
}
