import express from 'express';

import { createShiftSubjectController, getAllShiftSubjectContoller } from "../controllers/shiftSubjectModule/shiftSubject.contoller.js";

const  router = express.Router();

router.post('/create/shift_subject', createShiftSubjectController);

router.get('/getAllShiftSubject', getAllShiftSubjectContoller);

export default router;