import * as formik from "formik";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import * as yup from "yup";

const ValidationForm = () => {
  const { Formik } = formik;

  const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    username: yup.string().required("Username is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zip: yup.string().required("Zip code is required"),
    file: yup.mixed().required("File upload is required"),
    terms: yup.bool().oneOf([true], "Terms must be accepted"),
    dob: yup.date().required("Date of birth is required").nullable(),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(/^\+(?:[0-9] ?){6,14}[0-9]$/, "Invalid phone number"),
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email address"),
    interests: yup
      .array()
      .of(yup.string())
      .min(1, "Select at least one interest")
      .required("Select at least one interest"),
  });

  return (
    <Container className="my-3">
      <Formik
        validationSchema={schema}
        onSubmit={(values) => {
          console.log(values);
        }}
        initialValues={{
          firstName: "",
          lastName: "",
          username: "",
          city: "",
          state: "",
          zip: "",
          file: null,
          terms: false,
          dob: null,
          phone: "",
          email: "",
          interests: [],
        }}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          touched,
          errors,
          isValid,
          dirty,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group
                as={Col}
                md="4"
                controlId="validationFormik101"
                className="position-relative"
              >
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  isValid={touched.firstName && !errors.firstName}
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                as={Col}
                md="4"
                controlId="validationFormik102"
                className="position-relative"
              >
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  isValid={touched.lastName && !errors.lastName}
                  isInvalid={!!errors.lastName}
                />

                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="validationFormikUsername2">
                <Form.Label>Username</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    aria-describedby="inputGroupPrepend"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.username}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group
                as={Col}
                md="6"
                controlId="validationFormik103"
                className="position-relative"
              >
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="City"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  isValid={touched.city && !errors.city}
                  isInvalid={!!errors.city}
                />

                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.city}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                as={Col}
                md="3"
                controlId="validationFormik104"
                className="position-relative"
              >
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="State"
                  name="state"
                  value={values.state}
                  onChange={handleChange}
                  isValid={touched.state && !errors.state}
                  isInvalid={!!errors.state}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.state}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                as={Col}
                md="3"
                controlId="validationFormik105"
                className="position-relative"
              >
                <Form.Label>Zip</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Zip"
                  name="zip"
                  value={values.zip}
                  onChange={handleChange}
                  isValid={touched.zip && !errors.zip}
                  isInvalid={!!errors.zip}
                />

                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.zip}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group
                as={Col}
                md="6"
                controlId="validationFormikDob"
                className="position-relative"
              >
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={values.dob}
                  onChange={handleChange}
                  isInvalid={!!errors.dob}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.dob}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                as={Col}
                md="6"
                controlId="validationFormikPhone"
                className="position-relative"
              >
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="+1234567890"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  isInvalid={!!errors.phone}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group
                as={Col}
                md="6"
                controlId="validationFormikEmail"
                className="position-relative"
              >
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="example@example.com"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                as={Col}
                md="6"
                controlId="validationFormikInterests"
                className="position-relative"
              >
                <Form.Label>Interests</Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Sports"
                  name="interests"
                  value="sports"
                  checked={values.interests.includes("sports")}
                  onChange={handleChange}
                  isInvalid={!!errors.interests}
                />
                <Form.Check
                  type="checkbox"
                  label="Music"
                  name="interests"
                  value="music"
                  checked={values.interests.includes("music")}
                  onChange={handleChange}
                  isInvalid={!!errors.interests}
                />
                <Form.Check
                  type="checkbox"
                  label="Reading"
                  name="interests"
                  value="reading"
                  checked={values.interests.includes("reading")}
                  onChange={handleChange}
                  isInvalid={!!errors.interests}
                  feedback={errors.interests}
                  feedbackType="invalid"
                  feedbackTooltip
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.interests}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="position-relative mb-3">
                <Form.Label>File</Form.Label>
                <Form.Control
                  type="file"
                  required
                  name="file"
                  onChange={handleChange}
                  isInvalid={!!errors.file}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.file}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Form.Group className="position-relative mb-3">
              <Form.Check
                required
                name="terms"
                label="Agree to terms and conditions"
                onChange={handleChange}
                isInvalid={!!errors.terms}
                feedback={errors.terms}
                feedbackType="invalid"
                id="validationFormik106"
                feedbackTooltip
              />
            </Form.Group>
            <Button type="submit" disabled={!isValid || !dirty}>
              Submit form
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default ValidationForm;
