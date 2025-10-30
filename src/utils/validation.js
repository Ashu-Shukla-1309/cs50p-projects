import { VALIDATION } from '../config/constants';

/**
 * Validate student name
 * @param {string} name - Student name
 * @returns {object} Validation result { valid: boolean, error: string }
 */
export const validateStudentName = (name) => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Student name is required' };
  }

  if (name.length < VALIDATION.studentName.min) {
    return { valid: false, error: `Student name must be at least ${VALIDATION.studentName.min} characters` };
  }

  if (name.length > VALIDATION.studentName.max) {
    return { valid: false, error: `Student name must be less than ${VALIDATION.studentName.max} characters` };
  }

  if (!VALIDATION.studentName.pattern.test(name)) {
    return { valid: false, error: 'Please use only letters, spaces, and basic punctuation' };
  }

  return { valid: true, error: null };
};

/**
 * Validate course name
 * @param {string} course - Course name
 * @returns {object} Validation result
 */
export const validateCourse = (course) => {
  if (!course || course.trim().length === 0) {
    return { valid: false, error: 'Course is required' };
  }

  if (course.length < VALIDATION.course.min) {
    return { valid: false, error: `Course must be at least ${VALIDATION.course.min} characters` };
  }

  if (course.length > VALIDATION.course.max) {
    return { valid: false, error: `Course must be less than ${VALIDATION.course.max} characters` };
  }

  return { valid: true, error: null };
};

/**
 * Validate duration
 * @param {string} duration - Duration
 * @returns {object} Validation result
 */
export const validateDuration = (duration) => {
  if (!duration || duration.trim().length === 0) {
    return { valid: false, error: 'Duration is required' };
  }

  if (duration.length < VALIDATION.duration.min) {
    return { valid: false, error: `Duration must be at least ${VALIDATION.duration.min} character` };
  }

  if (duration.length > VALIDATION.duration.max) {
    return { valid: false, error: `Duration must be less than ${VALIDATION.duration.max} characters` };
  }

  return { valid: true, error: null };
};

/**
 * Validate grade
 * @param {string} grade - Grade
 * @returns {object} Validation result
 */
export const validateGrade = (grade) => {
  if (!grade || grade.trim().length === 0) {
    return { valid: false, error: 'Grade is required' };
  }

  if (grade.length < VALIDATION.grade.min) {
    return { valid: false, error: `Grade must be at least ${VALIDATION.grade.min} character` };
  }

  if (grade.length > VALIDATION.grade.max) {
    return { valid: false, error: `Grade must be less than ${VALIDATION.grade.max} characters` };
  }

  return { valid: true, error: null };
};

/**
 * Validate credential type
 * @param {string} credentialType - Credential type
 * @returns {object} Validation result
 */
export const validateCredentialType = (credentialType) => {
  if (!credentialType || credentialType.trim().length === 0) {
    return { valid: false, error: 'Credential type is required' };
  }

  return { valid: true, error: null };
};

/**
 * Validate institution name
 * @param {string} name - Institution name
 * @returns {object} Validation result
 */
export const validateInstitutionName = (name) => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Institution name is required' };
  }

  if (name.length < VALIDATION.institutionName.min) {
    return { valid: false, error: `Institution name must be at least ${VALIDATION.institutionName.min} characters` };
  }

  if (name.length > VALIDATION.institutionName.max) {
    return { valid: false, error: `Institution name must be less than ${VALIDATION.institutionName.max} characters` };
  }

  if (!VALIDATION.institutionName.pattern.test(name)) {
    return { valid: false, error: 'Please use only letters, numbers, spaces, and hyphens' };
  }

  return { valid: true, error: null };
};

/**
 * Validate URL
 * @param {string} url - URL
 * @returns {object} Validation result
 */
export const validateURL = (url) => {
  if (!url || url.trim().length === 0) {
    return { valid: false, error: 'URL is required' };
  }

  if (!VALIDATION.url.pattern.test(url)) {
    return { valid: false, error: 'Please enter a valid URL starting with http:// or https://' };
  }

  return { valid: true, error: null };
};

/**
 * Validate logo URL
 * @param {string} logoUrl - Logo URL
 * @returns {object} Validation result
 */
export const validateLogoURL = (logoUrl) => {
  if (!logoUrl || logoUrl.trim().length === 0) {
    return { valid: false, error: 'Logo URL is required' };
  }

  if (!VALIDATION.logoUrl.pattern.test(logoUrl)) {
    return { valid: false, error: 'Logo URL must be a valid image (PNG, JPG, JPEG, or SVG)' };
  }

  return { valid: true, error: null };
};

/**
 * Validate certificate hash
 * @param {string} hash - Certificate hash
 * @returns {object} Validation result
 */
export const validateCertificateHash = (hash) => {
  if (!hash || hash.trim().length === 0) {
    return { valid: false, error: 'Certificate hash is required' };
  }

  // Clean up hash (remove spaces, convert to lowercase)
  const cleanHash = hash.trim().toLowerCase();

  if (!VALIDATION.certificateHash.pattern.test(cleanHash)) {
    return { valid: false, error: 'Invalid certificate hash format. Must start with 0x and be 66 characters.' };
  }

  return { valid: true, error: null, cleanHash };
};

/**
 * Validate all certificate form fields
 * @param {object} formData - Form data
 * @returns {object} Validation result { valid: boolean, errors: object }
 */
export const validateCertificateForm = (formData) => {
  const errors = {};

  const studentNameResult = validateStudentName(formData.studentName);
  if (!studentNameResult.valid) {
    errors.studentName = studentNameResult.error;
  }

  const courseResult = validateCourse(formData.course);
  if (!courseResult.valid) {
    errors.course = courseResult.error;
  }

  const durationResult = validateDuration(formData.duration);
  if (!durationResult.valid) {
    errors.duration = durationResult.error;
  }

  const gradeResult = validateGrade(formData.grade);
  if (!gradeResult.valid) {
    errors.grade = gradeResult.error;
  }

  const credentialTypeResult = validateCredentialType(formData.credentialType);
  if (!credentialTypeResult.valid) {
    errors.credentialType = credentialTypeResult.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate all institution form fields
 * @param {object} formData - Form data
 * @returns {object} Validation result { valid: boolean, errors: object }
 */
export const validateInstitutionForm = (formData) => {
  const errors = {};

  const nameResult = validateInstitutionName(formData.name);
  if (!nameResult.valid) {
    errors.name = nameResult.error;
  }

  const websiteResult = validateURL(formData.website);
  if (!websiteResult.valid) {
    errors.website = websiteResult.error;
  }

  const logoResult = validateLogoURL(formData.logoUrl);
  if (!logoResult.valid) {
    errors.logoUrl = logoResult.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
