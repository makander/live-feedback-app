import UserServices from './user-services';

// Load validation
import { validateRegisterInput, validateLoginInput } from '../../../validation';

export const register = async function(req, res, next) {
  try {
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const result = await UserServices.register(req, res, next);

    if (!result.ok) {
      return res.status(400).json(result.error);
    }
    
    return res.status(200).json({ ok: true, data: result.data.toRegJSON() });
  } catch (error) {
    return res.json(error);
  }
};

export const login = function(req, res, next) {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // @TODO: actually login.

  return next();
};

export const getUser = function(req, res, next) {
  res.json({ ok: true, data: req.user.toRegJSON() });
  return next();
};

export const secret = function(req, res) {
  res.json({
    ok: true,
    data: `Welcome ${req.user.username} to our secret content!`
  });
};
