package users

import "time"

var testUser *User = &User{
	ID:           1,
	Email:        "pavelbat@uw.edu",
	PassHash:     []byte("hunter2_"),
	UserName:     "pavelbat",
	FirstName:    "Pavel",
	LastName:     "Batalov",
	PhotoURL:     "url",
}

//testUserStore returns same user for all operations
type testUserStore struct {
	user *User
}

//NewtestUserStore creates and returns a new testUserStore
func NewTestUserStore() *testUserStore {
	user := testUser
	return &testUserStore{user}
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
