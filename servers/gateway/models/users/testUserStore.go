package users

import (
	"time"
)

var testNewUser *NewUser = &NewUser{
	Email:        "pavelbat@uw.edu",
	Password:     "hunter2_",
	PasswordConf: "hunter2_",
	UserName:     "pavelbat",
	FirstName:    "Pavel",
	LastName:     "Batalov",
}

//testUserStore returns same user for all operations
type testUserStore struct {
	user *User
}

//NewtestUserStore creates and returns a new testUserStore
func NewTestUserStore() *testUserStore {
	testUser, _ := testNewUser.ToUser()
	testUser.ID = 1
	return &testUserStore{testUser}
}

func (testStore *testUserStore) GetByID(id int64) (*User, error) {
	if id != testStore.user.ID {
		return nil, ErrUserNotFound
	}
	return testStore.user, nil
}

func (testStore *testUserStore) GetByEmail(email string) (*User, error) {
	if email != testStore.user.Email {
		return nil, ErrUserNotFound
	}
	return testStore.user, nil
}

func (testStore *testUserStore) GetByUserName(username string) (*User, error) {
	if username != testStore.user.UserName {
		return nil, ErrUserNotFound
	}
	return testStore.user, nil
}

func (testStore *testUserStore) Insert(user *User) (*User, error) {
	return testStore.user, nil
}

func (testStore *testUserStore) InsertSignIn(user *User, signInTime time.Time, signInIP string) (error) {
	return nil
}

func (testStore *testUserStore) Update(id int64, updates *Updates) (*User, error) {
	if id != testStore.user.ID {
		return nil, ErrUserNotFound
	}
	testStore.user.FirstName = updates.FirstName
	testStore.user.LastName = updates.LastName
	return testStore.user, nil
}

func (testStore *testUserStore) Delete(id int64) error {
	if id != testStore.user.ID {
		return ErrUserNotFound
	}
	return nil
}
