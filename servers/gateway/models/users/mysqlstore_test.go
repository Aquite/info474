package users

import (
	"reflect"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
)

// TestGetByID is a test function for the SQLStore's GetByID
func TestGetByID(t *testing.T) {
	// Create a slice of test cases
	cases := []struct {
		name         string
		expectedUser *User
		idToGet      int64
		expectError  bool
	}{
		{
			"User Found",
			&User{
				1,
				"test@test.com",
				[]byte("passhash123"),
				"username",
				"firstname",
				"lastname",
				"photourl",
			},
			1,
			false,
		},
		{
			"User Not Found",
			&User{},
			2,
			true,
		},
		{
			"User With Large ID Found",
			&User{
				1234567890,
				"test@test.com",
				[]byte("passhash123"),
				"username",
				"firstname",
				"lastname",
				"photourl",
			},
			1234567890,
			false,
		},
	}

	for _, c := range cases {
		// Create a new mock database for each case
		db, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("There was a problem opening a database connection: [%v]", err)
		}
		defer db.Close()

		// TODO: update based on the name of your type struct
		mainSQLStore := &SQLStore{db}

		// Create an expected row to the mock DB
		row := mock.NewRows([]string{
			"ID",
			"Email",
			"PassHash",
			"UserName",
			"FirstName",
			"LastName",
			"PhotoURL"},
		).AddRow(
			c.expectedUser.ID,
			c.expectedUser.Email,
			c.expectedUser.PassHash,
			c.expectedUser.UserName,
			c.expectedUser.FirstName,
			c.expectedUser.LastName,
			c.expectedUser.PhotoURL,
		)

		// TODO: update to match the query used in your Store implementation
		query := "select id,email,passHash,username,firstName,lastName,photoUrl from Users where id=?"

		if c.expectError {
			// Set up expected query that will expect an error
			mock.ExpectQuery(query).WithArgs(c.idToGet).WillReturnError(ErrUserNotFound)

			// Test GetByID()
			user, err := mainSQLStore.GetByID(c.idToGet)
			if user != nil || err == nil {
				t.Errorf("Expected error [%v] but got [%v] instead", ErrUserNotFound, err)
			}
		} else {
			// Set up an expected query with the expected row from the mock DB
			mock.ExpectQuery(query).WithArgs(c.idToGet).WillReturnRows(row)

			// Test GetByID()
			user, err := mainSQLStore.GetByID(c.idToGet)
			if err != nil {
				t.Errorf("Unexpected error on successful test [%s]: %v", c.name, err)
			}
			if !reflect.DeepEqual(user, c.expectedUser) {
				t.Errorf("Error, invalid match in test [%s]", c.name)
			}
		}

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("There were unfulfilled expectations: %s", err)
		}

	}
}

// TestGetByEmail is a test function for the SQLStore's GetByEmail
func TestGetByEmail(t *testing.T) {
	// Create a slice of test cases
	cases := []struct {
		name         string
		expectedUser *User
		emailToGet   string
		expectError  bool
	}{
		{
			"User Found",
			&User{
				1,
				"test@test.com",
				[]byte("passhash123"),
				"username",
				"firstname",
				"lastname",
				"photourl",
			},
			"test@test.com",
			false,
		},
		{
			"User Not Found",
			&User{},
			"cats@test.com",
			true,
		},
	}

	for _, c := range cases {
		// Create a new mock database for each case
		db, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("There was a problem opening a database connection: [%v]", err)
		}
		defer db.Close()

		// TODO: update based on the name of your type struct
		mainSQLStore := &SQLStore{db}

		// Create an expected row to the mock DB
		row := mock.NewRows([]string{
			"ID",
			"Email",
			"PassHash",
			"UserName",
			"FirstName",
			"LastName",
			"PhotoURL"},
		).AddRow(
			c.expectedUser.ID,
			c.expectedUser.Email,
			c.expectedUser.PassHash,
			c.expectedUser.UserName,
			c.expectedUser.FirstName,
			c.expectedUser.LastName,
			c.expectedUser.PhotoURL,
		)

		// TODO: update to match the query used in your Store implementation
		query := "select id,email,passHash,username,firstName,lastName,photoUrl from Users where email=?"

		if c.expectError {
			// Set up expected query that will expect an error
			mock.ExpectQuery(query).WithArgs(c.emailToGet).WillReturnError(ErrUserNotFound)

			// Test GetByEmail()
			user, err := mainSQLStore.GetByEmail(c.emailToGet)
			if user != nil || err == nil {
				t.Errorf("Expected error [%v] but got [%v] instead", ErrUserNotFound, err)
			}
		} else {
			// Set up an expected query with the expected row from the mock DB
			mock.ExpectQuery(query).WithArgs(c.emailToGet).WillReturnRows(row)

			// Test GetByEmail()
			user, err := mainSQLStore.GetByEmail(c.emailToGet)
			if err != nil {
				t.Errorf("Unexpected error on successful test [%s]: %v", c.name, err)
			}
			if !reflect.DeepEqual(user, c.expectedUser) {
				t.Errorf("Error, invalid match in test [%s]", c.name)
			}
		}

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("There were unfulfilled expectations: %s", err)
		}

	}
}

// TestGetByUserName is a test function for the SQLStore's GetByUserName
func TestGetByUserName(t *testing.T) {
	// Create a slice of test cases
	cases := []struct {
		name         string
		expectedUser *User
		nameToGet   string
		expectError  bool
	}{
		{
			"User Found",
			&User{
				1,
				"test@test.com",
				[]byte("passhash123"),
				"username",
				"firstname",
				"lastname",
				"photourl",
			},
			"username",
			false,
		},
		{
			"User Not Found",
			&User{},
			"james",
			true,
		},
	}

	for _, c := range cases {
		// Create a new mock database for each case
		db, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("There was a problem opening a database connection: [%v]", err)
		}
		defer db.Close()

		// TODO: update based on the name of your type struct
		mainSQLStore := &SQLStore{db}

		// Create an expected row to the mock DB
		row := mock.NewRows([]string{
			"ID",
			"Email",
			"PassHash",
			"UserName",
			"FirstName",
			"LastName",
			"PhotoURL"},
		).AddRow(
			c.expectedUser.ID,
			c.expectedUser.Email,
			c.expectedUser.PassHash,
			c.expectedUser.UserName,
			c.expectedUser.FirstName,
			c.expectedUser.LastName,
			c.expectedUser.PhotoURL,
		)

		// TODO: update to match the query used in your Store implementation
		query := "select id,email,passHash,username,firstName,lastName,photoUrl from Users where username=?"

		if c.expectError {
			// Set up expected query that will expect an error
			mock.ExpectQuery(query).WithArgs(c.nameToGet).WillReturnError(ErrUserNotFound)

			// Test GetByName()
			user, err := mainSQLStore.GetByUserName(c.nameToGet)
			if user != nil || err == nil {
				t.Errorf("Expected error [%v] but got [%v] instead", ErrUserNotFound, err)
			}
		} else {
			// Set up an expected query with the expected row from the mock DB
			mock.ExpectQuery(query).WithArgs(c.nameToGet).WillReturnRows(row)

			// Test GetByUserName()
			user, err := mainSQLStore.GetByUserName(c.nameToGet)
			if err != nil {
				t.Errorf("Unexpected error on successful test [%s]: %v", c.name, err)
			}
			if !reflect.DeepEqual(user, c.expectedUser) {
				t.Errorf("Error, invalid match in test [%s]", c.name)
			}
		}

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("There were unfulfilled expectations: %s", err)
		}

	}
}

// TestInsert is a test function for the SQLStore's Insert
func TestInsert(t *testing.T) {
	// Create a slice of test cases
	cases := []struct {
		name         string
		expectedUser *User
		nameToGet   string
		expectError  bool
	}{
		{
			"User Found",
			&User{
				1,
				"test@test.com",
				[]byte("passhash123"),
				"username",
				"firstname",
				"lastname",
				"photourl",
			},
			"username",
			false,
		},
		{
			"User Not Found",
			&User{},
			"james",
			true,
		},
	}

	for _, c := range cases {
		// Create a new mock database for each case
		db, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("There was a problem opening a database connection: [%v]", err)
		}
		defer db.Close()

		// TODO: update based on the name of your type struct
		mainSQLStore := &SQLStore{db}

		// Create an expected row to the mock DB
		row := mock.NewRows([]string{
			"ID",
			"Email",
			"PassHash",
			"UserName",
			"FirstName",
			"LastName",
			"PhotoURL"},
		).AddRow(
			c.expectedUser.ID,
			c.expectedUser.Email,
			c.expectedUser.PassHash,
			c.expectedUser.UserName,
			c.expectedUser.FirstName,
			c.expectedUser.LastName,
			c.expectedUser.PhotoURL,
		)

		// TODO: update to match the query used in your Store implementation
		query := "select id,email,passHash,username,firstName,lastName,photoUrl from Users where username=?"

		if c.expectError {
			// Set up expected query that will expect an error
			mock.ExpectQuery(query).WithArgs(c.nameToGet).WillReturnError(ErrUserNotFound)

			// Test GetByName()
			user, err := mainSQLStore.GetByUserName(c.nameToGet)
			if user != nil || err == nil {
				t.Errorf("Expected error [%v] but got [%v] instead", ErrUserNotFound, err)
			}
		} else {
			// Set up an expected query with the expected row from the mock DB
			mock.ExpectQuery(query).WithArgs(c.nameToGet).WillReturnRows(row)

			// Test GetByUserName()
			user, err := mainSQLStore.GetByUserName(c.nameToGet)
			if err != nil {
				t.Errorf("Unexpected error on successful test [%s]: %v", c.name, err)
			}
			if !reflect.DeepEqual(user, c.expectedUser) {
				t.Errorf("Error, invalid match in test [%s]", c.name)
			}
		}

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("There were unfulfilled expectations: %s", err)
		}

	}
}