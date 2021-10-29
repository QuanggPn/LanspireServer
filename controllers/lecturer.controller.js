const { Lecturer, User } = require('../models');

const create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }

  // Create a Lecturer
  const user = {
    username: req.body.username,
    password: req.body.password,
    displayName: req.body.displayName,
    gender: req.body.gender,
    phoneNumber: req.body.phoneNumber,
    imageUrl: req.body.imageUrl,
    address: req.body.address,
    dob: req.body.dob,
    idRole: req.body.idRole,
    isActivated: true,
  };
  // Save Lecturer in the database
  User.create(user)
    .then(createdUser => {
      Lecturer.create({
        idUser: createdUser.idUser,
        isDeleted: false,
      }).then(createdLecturer => {
        const { idLecturer, idUser, isDeleted } = createdLecturer;
        const User = {
          username: createdUser.username,
          password: createdUser.password,
          displayName: createdUser.displayName,
          gender: createdUser.gender,
          phoneNumber: createdUser.phoneNumber,
          imageUrl: createdUser.imageUrl,
          address: createdUser.address,
          dob: createdUser.dob,
          idRole: createdUser.idRole,
          isActivated: createdUser.isActivated,
        };

        res.send({ idLecturer, idUser, isDeleted, ...User });
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Lecturer.',
      });
    });
};

// Retrieve all Lecturers from the database.
const findAll = (req, res) => {
  Lecturer.findAll({
    where: {
      isDeleted: false,
    },
    include: [{ model: User }],
  })
    .then(data => {
      const response = data.map(item => {
        return {
          idLecturer: item.idLecturer,
          idUser: item.idUser,
          isDeleted: item.isDeleted,
          username: item.User.username == null ? null : item.User.username,
          password: item.User.password == null ? null : item.User.password,
          displayName: item.User.displayName,
          gender: item.User.gender,
          phoneNumber: item.User.phoneNumber,
          imageUrl: item.User.imageUrl,
          address: item.User.address,
          dob: item.User.dob,
          idRole: item.User.idRole == null ? null : item.User.idRole,
          isActivated: item.User.isActivated,
        };
      });
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving lecturers.',
      });
    });
};

// Find a single Lecturer with an id
const findOne = (req, res) => {
  const idLecturer = req.params.idLecturer;

  Lecturer.findByPk(idLecturer, {
    include: [{ model: User }],
  })
    .then(data => {
      if (data) {
        const { idLecturer, idUser, isDeleted, User } = data;
        const user = {
          username: User.username == null ? null : User.username,
          password: User.password == null ? null : User.password,
          displayName: User.displayName,
          gender: User.gender,
          phoneNumber: User.phoneNumber,
          imageUrl: User.imageUrl,
          address: User.address,
          dob: User.dob,
          idRole: User.idRole == null ? null : User.idRole,
          isActivated: User.isActivated,
        };
        res.send({ idLecturer, idUser, isDeleted, ...user });
      } else {
        res.status(404).send({
          message: `Cannot find Lecturer with idLecturer=${idLecturer}.`,
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Error retrieving Lecturer with id=' + idLecturer,
      });
    });
};

// Update a Lecturer by the id in the request
const update = (req, res) => {
  const idLecturer = req.params.idLecturer;

  Lecturer.update(req.body, {
    where: { idLecturer: idLecturer },
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Lecturer was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Lecturer with id=${idLecturer}. Maybe Lecturer was not found or req.body is empty!`,
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Error updating Lecturer with id=' + idLecturer,
      });
    });
};

// Delete a Lecturer with the specified id in the request
const remove = (req, res) => {
  const idLecturer = req.params.idLecturer;

  Lecturer.update(
    {
      isDeleted: true,
    },
    {
      where: { idLecturer: idLecturer },
    }
  )
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Lecturer was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Lecturer with id=${idLecturer}. Maybe Lecturer was not found!`,
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Could not delete Lecturer with id=' + idLecturer,
      });
    });
};

module.exports = { create, findAll, findOne, update, remove };
