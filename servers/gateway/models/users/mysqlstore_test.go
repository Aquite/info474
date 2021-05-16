package users

import (
	"reflect"
	"regexp"
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
		query := regexp.QuoteMeta("select * from Users where id=?")

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
		query := regexp.QuoteMeta("select * from Users where email=?")

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
		query := regexp.QuoteMeta("select * from Users where username=?")

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
		deletedID     int64
		expectedUser *User
		expectError  bool
	}{
		{
			"Valid user",
			1,
			&User{
				1,
				"test@test.com",
				[]byte("passhash123"),
				"username",
				"firstname",
				"lastname",
				"photourl",
			},
			false,
		},
		{
			"Long user",
			1,
			&User{
				1,
				"testfeafseeawfeawsf@tefafeafeeaeaegwweagweagfeest.com",
				[]byte("pasefaefeasfefshaegwgewaegsh123"),
				"useefasfeasfegwgerwgetggewgeasfrname",
				"firsfeafeefegegeagasfesatname",
				"lastnfeefsafesaefasgegeawgeefsaame",
				"photoefsafesaeasfefasurl",
			},
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

		mainSQLStore := &SQLStore{db}

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

		query := regexp.QuoteMeta("insert into Users(Email, PassHash, UserName, FirstName, LastName, PhotoURL) values (?,?,?,?,?,?)")
		getID := regexp.QuoteMeta("select * from Users where id=?")

		if !c.expectError {
			// Set up an expected query with the expected row from the mock DB
			mock.ExpectExec(query).WithArgs(c.expectedUser.Email, c.expectedUser.PassHash, c.expectedUser.UserName, c.expectedUser.FirstName, c.expectedUser.LastName, c.expectedUser.PhotoURL).WillReturnResult(sqlmock.NewResult(1, 1))
			mock.ExpectQuery(getID).WithArgs(c.deletedID).WillReturnRows(row)
			// Test GetByUserName()
			user, err := mainSQLStore.Insert(c.expectedUser)
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

// TestDelete is a test function for the SQLStore's Delete
func TestDelete(t *testing.T) {
	// Create a slice of test cases
	cases := []struct {
		name         string
		deletedID     int64
		expectedUser *User
		expectError  bool
	}{
		{
			"Valid user",
			1,
			&User{
				1,
				"test@test.com",
				[]byte("passhash123"),
				"username",
				"firstname",
				"lastname",
				"photourl",
			},
			false,
		},
		{
			"Long user",
			1,
			&User{
				1,
				"testfeafseeawfeawsf@tefafeafeeaeaegwweagweagfeest.com",
				[]byte("pasefaefeasfefshaegwgewaegsh123"),
				"useefasfeasfegwgerwgetggewgeasfrname",
				"firsfeafeefegegeagasfesatname",
				"lastnfeefsafesaefasgegeawgeefsaame",
				"photoefsafesaeasfefasurl",
			},
			false,
		},
		{
			"Invalid ID",
			34598042367,
			&User{
				1,
				"testfeafseeawfeawsf@tefafeafeeaeaegwweagweagfeest.com",
				[]byte("pasefaefeasfefshaegwgewaegsh123"),
				"useefasfeasfegwgerwgetggewgeasfrname",
				"firsfeafeefegegeagasfesatname",
				"lastnfeefsafesaefasgegeawgeefsaame",
				"photoefsafesaeasfefasurl",
			},
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

		mainSQLStore := &SQLStore{db}

		query := regexp.QuoteMeta("insert into Users(Email, PassHash, UserName, FirstName, LastName, PhotoURL) values (?,?,?,?,?,?)")
		// Set up an expected query with the expected row from the mock DB
		mock.ExpectExec(query).WithArgs(c.expectedUser.Email, c.expectedUser.PassHash, c.expectedUser.UserName, c.expectedUser.FirstName, c.expectedUser.LastName, c.expectedUser.PhotoURL).WillReturnResult(sqlmock.NewResult(1, 1))
		// Test GetByUserName()
		_, _ = mainSQLStore.Insert(c.expectedUser)

		query2 := "delete from Users where id=?"

		if c.expectError {
			mock.ExpectExec(query2).WithArgs(c.deletedID).WillReturnError(ErrUserNotFound)
			err = mainSQLStore.Delete(c.deletedID)
			if err == nil {
				t.Errorf("Expected error [%v] but got [%v] instead", ErrUserNotFound, err)
			}
		} else {
			// Set up an expected query with the expected row from the mock DB
			mock.ExpectExec(query2).WithArgs(1).WillReturnResult(sqlmock.NewResult(1, 1))
			err = mainSQLStore.Delete(c.deletedID)
			if err != nil {
				t.Errorf("Unexpected error on successful test [%s]: %v", c.name, err)
			}
		}

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("There were unfulfilled expectations: %s", err)
		}
	}
}

// TestUpdate is a test function for the SQLStore's Update
func TestUpdate(t *testing.T) {
	// Create a slice of test cases
	cases := []struct {
		name         string
		expectedUser *User
		updates      *Updates
		expectError  bool
	}{
		{
			"Valid user",
			&User{
				1,
				"test@test.com",
				[]byte("passhash123"),
				"username",
				"firstname",
				"lastname",
				"photourl",
			},
			&Updates{
				"John",
				"Cena",
			},
			false,
		},
		{
			"Bad ID",
			&User{
				43532543,
				"test@test.com",
				[]byte("passhash123"),
				"username",
				"firstname",
				"lastname",
				"photourl",
			},
			&Updates{
				"username",
				"password",
			},
			true,
		},
		{
			"No Change",
			&User{
				1,
				"test@test.com",
				[]byte("passhash123"),
				"username",
				"firstname",
				"lastname",
				"photourl",
			},
			&Updates{
				"username",
				"password",
			},
			false,
		},
		{
			"Empty",
			&User{
				1,
				"test@test.com",
				[]byte("passhash123"),
				"username",
				"firstname",
				"lastname",
				"photourl",
			},
			&Updates{
				"",
				"",
			},
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

		mainSQLStore := &SQLStore{db}

		query := regexp.QuoteMeta("insert into Users(Email, PassHash, UserName, FirstName, LastName, PhotoURL) values (?,?,?,?,?,?)")
		// Set up an expected query with the expected row from the mock DB
		mock.ExpectExec(query).WithArgs(c.expectedUser.Email, c.expectedUser.PassHash, c.expectedUser.UserName, c.expectedUser.FirstName, c.expectedUser.LastName, c.expectedUser.PhotoURL).WillReturnResult(sqlmock.NewResult(1, 1))
		// Test GetByUserName()
		_, _ = mainSQLStore.Insert(c.expectedUser)

		row := mock.NewRows([]string{
			"ID",
			"Email",
			"PassHash",
			"UserName",
			"FirstName",
			"LastName",
			"PhotoURL"},
		).AddRow(
			1,
			c.expectedUser.Email,
			c.expectedUser.PassHash,
			c.expectedUser.UserName,
			c.expectedUser.FirstName,
			c.expectedUser.LastName,
			c.expectedUser.PhotoURL,
		)
		query2 := regexp.QuoteMeta("update Users set FirstName=?, LastName=? where id=?")
		getId := regexp.QuoteMeta("select * from Users where id=?")
		if c.expectError {
			mock.ExpectExec(query2).WithArgs(c.updates.FirstName, c.updates.LastName, c.expectedUser.ID).WillReturnError(ErrUserNotFound)
			_, err = mainSQLStore.Update(c.expectedUser.ID, c.updates)
			if err == nil {
				t.Errorf("Expected error [%v] but got [%v] instead", ErrUserNotFound, err)
			}
		} else {
			// Set up an expected query with the expected row from the mock DB
			mock.ExpectExec(query2).WithArgs(c.updates.FirstName, c.updates.LastName, 1).WillReturnResult(sqlmock.NewResult(1, 1))
			mock.ExpectQuery(getId).WithArgs(1).WillReturnRows(row)
			_, err = mainSQLStore.Update(1, c.updates)
			if err != nil {
				t.Errorf("Unexpected error on successful test [%s]: %v", c.name, err)
			}
		}

		if err := mock.ExpectationsWereMet(); err != nil {
			t.Errorf("There were unfulfilled expectations: %s", err)
		}
	}
}