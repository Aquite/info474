package users

import (
	"crypto/md5"
	"encoding/hex"
	"strings"
	"testing"
)

//TODO: add tests for the various functions in user.go, as described in the assignment.
//use `go test -cover` to ensure that you are covering all or nearly all of your code paths.
func TestValidate(t *testing.T) {
	cases := []struct {
		name        string
		desc        string
		nu          NewUser
		expectError bool
	}{
		{
			"Valid User",
			"This user is valid! Make sure your cases aren't overly restrictive!",
			NewUser{
				"mickey@cats.com",
				"Potato",
				"Potato",
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
			},
			false,
		},
		{
			"Valid User: Unicode",
			"This user uses unicode characters for multiple fields",
			NewUser{
				"貓@cats.com",
				"我愛貓但不吃早餐",
				"我愛貓但不吃早餐",
				"貓",
				"米奇",
				"哞",
			},
			false,
		},
		{
			"Valid User: missing names",
			"This user has chosen not to include a name",
			NewUser{
				"mickey@cats.com",
				"Potato",
				"Potato",
				"mickey_da_cat_69",
				"",
				"",
			},
			false,
		},
		{
			"Bad Email",
			"This user left the email blank",
			NewUser{
				"",
				"Potato",
				"Potato",
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
			},
			true,
		},
		{
			"Bad Email 2",
			"This user used an incorrect email format",
			NewUser{
				"mickey2cats.com",
				"Potato",
				"Potato",
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
			},
			true,
		},
		{
			"Bad Password",
			"This password is under six characters",
			NewUser{
				"mickey@cats.com",
				"iluvu",
				"iluvu",
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
			},
			true,
		},
		{
			"Password Mismatch",
			"The password and password confirmation don't match",
			NewUser{
				"mickey@cats.com",
				"catsrdbest",
				"catsareacceptable",
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
			},
			true,
		},
		{
			"Empty Username",
			"This username has been left empty",
			NewUser{
				"mickey@cats.com",
				"Potato",
				"Potato",
				"",
				"Mickey",
				"Moo",
			},
			true,
		},
		{
			"Spaces in Username",
			"This username has spaces",
			NewUser{
				"mickey@cats.com",
				"Potato",
				"Potato",
				"mickey da cat 69",
				"Mickey",
				"Moo",
			},
			true,
		},
	}

	for _, c := range cases {
		err := c.nu.Validate()
		if err != nil && !c.expectError {
			t.Errorf("case %s: unexpected error: %v\nDescription: %s", c.name, err, c.desc)
		}
		if c.expectError && err == nil {
			t.Errorf("case %s: expected error but didn't get one\nDescription: %s", c.name, c.desc)
		}
	}
}


func TestToUser(t *testing.T) {
	cases := []struct {
		name        string
		desc        string
		nu          NewUser
		checkEmail  string
		expectError bool
	}{
		{
			"Default User",
			"This user is valid and should not throw errors",
			NewUser{
				"mickey@cats.com",
				"Potato",
				"Potato",
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
			},
			"mickey@cats.com",
			false,
		},
		{
			"Email spaces",
			"This user has spaces in their email but still should be valid",
			NewUser{
				"mickey@cats.com    ",
				"Potato",
				"Potato",
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
			},
			"mickey@cats.com",
			false,
		},
		{
			"Email capitals",
			"This user has capital letters in their email but still should be valid",
			NewUser{
				"mIcKEy@cats.com",
				"Potato",
				"Potato",
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
			},
			"mickey@cats.com",
			false,
		},
		{
			"Bad email",
			"This user has an email in a bad format",
			NewUser{
				"mickeeee",
				"Potato",
				"Potato",
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
			},
			"mickeeee",
			true,
		},
	}

	for _, c := range cases {
		u, err := c.nu.ToUser()
		if err != nil && !c.expectError {
			t.Errorf("case %s: unexpected error: %v\nDescription: %s", c.name, err, c.desc)
		}
		if c.expectError && err == nil {
			t.Errorf("case %s: expected error but didn't get one\nDescription: %s", c.name, c.desc)
		}
		if u != nil {
			err = u.Authenticate(c.nu.Password) 
			if err != nil {
				t.Errorf("case %s: Password \"%s\"failed to encrypt\nDescription: %s", c.name, c.nu.Password, c.desc)
			}
			emailHasher := md5.New()
			emailHasher.Write([]byte(strings.ToLower(strings.TrimSpace(u.Email))))
			photoURL := gravatarBasePhotoURL + hex.EncodeToString(emailHasher.Sum(nil))
			if u.PhotoURL != photoURL {
				t.Errorf("case %s: Email \"%s\" failed to encrypt\nDescription: %s", c.name, c.nu.Email, c.desc)
			}
		}
	}
}

func TestFullName(t *testing.T) {
	cases := []struct {
		name        string
		desc        string
		u           User
		fullName    string
	}{
		{
			"Both Names",
			"This user has both a first name and a last name",
			User{
				0,
				"mickey@cats.com",
				nil,
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
				"",
			},
			"Mickey Moo",
		},
		{
			"First Name Only",
			"This user only has a first name",
			User{
				0,
				"mclovin@mclovin.com",
				nil,
				"mclovin_lover_420",
				"McLovin",
				"",
				"",
			},
			"McLovin",
		},
		{
			"Last Name Only",
			"This user only has a last name",
			User{
				0,
				"Socrates@thinkers-only.net",
				nil,
				"knowledgeispower",
				"",
				"Socrates",
				"",
			},
			"Socrates",
		},
		{
			"No Names",
			"This is a horse with no name",
			User{
				0,
				"horse@nameless.net",
				nil,
				"___",
				"",
				"",
				"",
			},
			"",
		},
	}

	for _, c := range cases {
		name := c.u.FullName()
		if name != c.fullName {
			t.Errorf("case %s: expected %s but received %s\nDescription: %s", c.name, c.fullName, name, c.desc)
		}
	}
}

func TestAuthenticate(t *testing.T) {
	cases := []struct {
		name        string
		desc        string
		u           User
		password    string
		input       string
		expectError bool
	}{
		{
			"Correct password",
			"Authentication attempted with correct password",
			User{
				0,
				"mickey@cats.com",
				nil,
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
				"",
			},
			"Potato",
			"Potato",
			false,
		},
		{
			"Case sensitive",
			"This attempt has lowercase letters in an uppercase password",
			User{
				0,
				"mickey@cats.com",
				nil,
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
				"",
			},
			"POTATO",
			"potato",
			true,
		},
		{
			"Incorrect password",
			"This attempt is just wrong",
			User{
				0,
				"mickey@cats.com",
				nil,
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
				"",
			},
			"Potato",
			"hunter2",
			true,
		},
		{
			"Empty password",
			"This attempt is an empty string",
			User{
				0,
				"mickey@cats.com",
				nil,
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
				"",
			},
			"Potato",
			"",
			true,
		},
	}

	for _, c := range cases {
		c.u.SetPassword(c.password)
		err := c.u.Authenticate(c.input)
		if err != nil && !c.expectError {
			t.Errorf("case %s: unexpected error: %v\nDescription: %s", c.name, err, c.desc)
		}
		if c.expectError && err == nil {
			t.Errorf("case %s: expected error but didn't get one\nDescription: %s", c.name, c.desc)
		}

	}
}

func TestApplyUpdates(t *testing.T) {
	cases := []struct {
		name        string
		desc        string
		u           User
		updates     *Updates
		expectError bool
	}{
		{
			"First Name",
			"The first name has been changed",
			User{
				0,
				"mickey@cats.com",
				nil,
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
				"",
			},
			&Updates{"Mickayyyy", "Moo"},
			false,
		},
		{
			"Last Name",
			"The last name has been changed",
			User{
				0,
				"mickey@cats.com",
				nil,
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
				"",
			},
			&Updates{"Mickey", "Moo Moo meadows"},
			false,
		},
		{
			"Both Names",
			"Both Names have been changed",
			User{
				0,
				"mickey@cats.com",
				nil,
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
				"",
			},
			&Updates{"Dante", "From Devil May Cry"},
			false,
		},
		{
			"No Change",
			"Nothing has been changed",
			User{
				0,
				"mickey@cats.com",
				nil,
				"mickey_da_cat_69",
				"Mickey",
				"Moo",
				"",
			},
			&Updates{"Mickey", "Moo"},
			false,
		},
	}

	for _, c := range cases {
		err := c.u.ApplyUpdates(c.updates)

		if err != nil && !c.expectError {
			t.Errorf("case %s: unexpected error: %v\nDescription: %s", c.name, err, c.desc)
		}
		if c.expectError && err == nil {
			t.Errorf("case %s: expected error but didn't get one\nDescription: %s", c.name, c.desc)
		}

		if c.u.FirstName != c.updates.FirstName {
			t.Errorf("case %s: failure to update first name\nExpected %s but recieved %s\nDescription: %s", c.name, c.updates.FirstName, c.u.FirstName, c.desc)
		}

		if c.u.LastName != c.updates.LastName {
			t.Errorf("case %s: failure to update last name\nExpected %s but recieved %s\nDescription: %s", c.name, c.updates.LastName, c.u.LastName, c.desc)
		}
	}
}