import React, {
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useState,
} from "react";
import CustomButtons from "../global_component/CustomButtons";
import { useDispatch } from "react-redux";
import DataTableComponent from "../global_component/DataTableComponent";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import {
  addPreviewLinkRecord,
  previewLinkList,
  updatePreviewLinkRecord,
} from "../redux/adminSlice";
import defaultIconImage from "../../assets/images/users/user1.jpg";
import CustomModal from "../global_component/CustomModal";
import { deleteRecord } from "../redux/globalSlice";
import * as Yup from "yup";
import { useFormik } from "formik";

const PreviewLink = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  //#region Datatables
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [searchParam, setSearchParam] = useState("");
  console.log(setCurrentPage);
  const handleCloseModal = useCallback(() => {
    setRowToDelete(null);
    setShowDeleteModal(false);
    setShowAddPreviewModal(false);
  }, []);
  const addPreviewLinkInitialValues = {
    id: "",
    title: "",
    description: "",
    link: "",
    primaryImage: "",
    isUpdate: false,
  };

  const addPreviewLinkValidationSchema = Yup.object().shape({
    isUpdate: Yup.bool().required(),
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .required("Title is required"),
    link: Yup.string()
      .min(3, "Link must be at least 3 characters")
      .required("Link is required"),
    primaryImage: Yup.mixed().when(["isUpdate"], (isUpdate, schema) => {
      return isUpdate[0]
        ? schema.optional()
        : schema
            .optional()
            .test("fileSize", "File size must be less than 2MB", (value) => {
              if (!value) return true; // No file selected, consider it valid
              const isFileSizeValid = value.size <= 2 * 1024 * 1024; // 2MB limit
              if (!isFileSizeValid) {
                throw new Yup.ValidationError(
                  "File size must be less than 2MB",
                  value,
                  "primaryImage",
                );
              }
              return isFileSizeValid;
            });
    }),
  });
  const fetchPreviewLinkList = useCallback(
    async (
      page = 1,
      size = 10,
      sortColumn = "",
      sortDirection = "",
      searchParam = "",
    ) => {
      setLoading(true);
      const params = {
        page,
        size,
        sortColumn,
        sortDirection,
        searchParam,
      };
      try {
        const response = await dispatch(previewLinkList(params));

        if (previewLinkList.fulfilled.match(response)) {
          const updatedList = response?.payload?.list?.map((item) => {
            if (item && !item.primaryImage) {
              item.primaryImage = defaultIconImage;
            }
            return item;
          });
          setData(updatedList);
          setTotalRows(response?.payload?.totalRecords);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching preview link records:", error);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    fetchPreviewLinkList(
      currentPage,
      perPage,
      sortColumn,
      sortDirection,
      searchParam,
    );
  }, [
    currentPage,
    perPage,
    sortColumn,
    sortDirection,
    searchParam,
    fetchPreviewLinkList,
  ]);

  const handlePerRowsChange = useCallback((newPerPage) => {
    setPerPage(newPerPage);
  }, []);

  const handleSort = useCallback((column, direction) => {
    if (column.selector && typeof column.selector === "string") {
      const colName =
        column.selector.charAt(0).toUpperCase() + column.selector.slice(1);
      setSortColumn(colName);
    }
    setSortDirection(direction === "asc" ? "asc" : "desc");
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchParam(e.target.value ? e.target.value : "");
  }, []);

  //#region delete preview link
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const onDelete = useCallback((row) => {
    setRowToDelete(row);
    setShowDeleteModal(true);
  }, []);

  const addPreviewLink = useFormik({
    initialValues: addPreviewLinkInitialValues,
    validationSchema: addPreviewLinkValidationSchema,
    onSubmit: async (values) => {
      try {
        setShowSpinner(true);
        if (values.isUpdate) {
          await dispatch(updatePreviewLinkRecord(values));
        } else {
          await dispatch(addPreviewLinkRecord(values));
        }
      } catch (error) {
        console.error("Error adding/updating preview link:", error);
      } finally {
        setShowSpinner(false);
        setShowAddPreviewModal(false);
        await fetchPreviewLinkList();
      }
    },
  });

  const deletePreviewLinkRecord = useCallback(async () => {
    setShowSpinner(true);
    const endpoint = `Admin/DeletePreviewLink?id=${rowToDelete.id}`;
    await dispatch(deleteRecord(endpoint));
    handleCloseModal();
    await fetchPreviewLinkList();
    setShowSpinner(false);
  }, [dispatch, fetchPreviewLinkList, rowToDelete, handleCloseModal]);

  //#endregion delete preview link

  //#region update preview link
  const onUpdate = useCallback(
    (row) => {
      addPreviewLink.setFieldValue("id", row.id);
      addPreviewLink.setFieldValue("title", row.title);
      addPreviewLink.setFieldValue("description", row.description);
      addPreviewLink.setFieldValue("link", row.link);
      addPreviewLink.setFieldValue("primaryImage", row.primaryImage);
      addPreviewLink.setFieldValue("isUpdate", true);
      setShowAddPreviewModal(true);
    },
    [addPreviewLink],
  );

  const buttons = useMemo(
    () => [
      {
        id: 1,
        title: "Delete",
        onClick: onDelete,
        className: "btn btn-sm btn-danger me-1",
        icon: "bi bi-trash",
      },
      {
        id: 2,
        title: "Update",
        onClick: onUpdate,
        className: "btn btn-sm btn-success me-1",
        icon: "bi bi-pencil-square",
      },
    ],
    [onDelete, onUpdate],
  );

  const columns = useMemo(
    () => [
      {
        name: "Title",
        sortable: true,
        selector: (row) => row.title,
      },
      {
        name: "Description",
        sortable: true,
        selector: (row) => row.description,
      },
      {
        name: "Link",
        sortable: true,
        selector: (row) => row.link,
        cell: (row) =>
          row.link ? (
            <a
              href={row.link}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-primary"
            >
              <span className="badge bg-primary">Link</span>
            </a>
          ) : (
            "N/A"
          ),
      },
      {
        name: "Preview Image",
        sortable: true,
        selector: (row) => row.primaryImage,
        cell: (row) => (
          <a href={row.primaryImage} target="_blank" rel="noreferrer">
            <img
              alt="preview_image"
              src={row.primaryImage}
              style={{ width: "50px" }}
            />
          </a>
        ),
      },
      {
        name: "Actions",
        sortable: false,
        cell: (row) => <CustomButtons buttons={buttons} row={row} />,
      },
    ],
    [buttons],
  );

  //#endregion update preview link

  //#region add preview link
  const [showAddPreviewModal, setShowAddPreviewModal] = useState(false);

  const addPreviewLinkButton = () => {
    setShowAddPreviewModal(true);
    addPreviewLink.resetForm();
  };

  //#region handle image
  const fileInputRef = useRef(null);
  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      addPreviewLink.setFieldValue("primaryImage", file);
    } else {
      addPreviewLink.setFieldValue("primaryImage", "");
      fileInputRef.current.value = "";
      alert("File Size must be less than 2MB");
    }
  };

  //#endregion handle image

  //#endregion add preview link

  return (
    <>
      <Card>
        <CardBody>
          <div
            className="card-body"
            style={{ borderBottom: "1px solid #e9e9e9" }}
          >
            <div className="row justify-content-center">
              <div className="col-md-4 offset-md-4 col-sm-12">
                <h4 className="text-center font-weight-bold">Preview Links</h4>
              </div>
              <div className="col-md-4 col-sm-12 text-end">
                <Button
                  title="Add New Preview Link"
                  onClick={addPreviewLinkButton}
                >
                  Add
                  <i className="pl-1 bi bi-link-45deg"></i>
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
        <CardBody>
          <div className="row">
            <div className="col-md-4 col-sm-12 mb-3">
              <div className="my-2 my-md-0 mw-100 navbar-search">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-light border-1 small"
                    placeholder="Search..."
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="table-responsive">
                <DataTableComponent
                  columns={columns}
                  data={data}
                  pagination
                  paginationServer
                  progressPending={loading}
                  paginationTotalRows={totalRows}
                  paginationDefaultPage={currentPage}
                  onChangeRowsPerPage={handlePerRowsChange}
                  // onChangePage={handlePageChange}
                  onSort={handleSort}
                />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <CustomModal
        show={showAddPreviewModal}
        onHide={handleCloseModal}
        size="lg"
        classes="bg-primary text-white py-2"
        title={
          !addPreviewLink.values.isUpdate
            ? "Add Preview Link"
            : "Update Preview Link"
        }
        body={
          <>
            <Form method="post" onSubmit={addPreviewLink.handleSubmit}>
              <Row>
                <Col md={12}>
                  <Form.Label className="fw-bold">Title</Form.Label>
                  <Form.Control
                    type="text"
                    autoComplete="off"
                    placeholder="Enter title"
                    className="form-control form-control-user"
                    value={addPreviewLink.values.title}
                    onChange={addPreviewLink.handleChange("title")}
                    onBlur={addPreviewLink.handleBlur("title")}
                  />
                  {addPreviewLink.errors.title && (
                    <small className="text-danger">
                      {addPreviewLink.errors.title}
                    </small>
                  )}
                </Col>
                <Col md={12} className="my-2">
                  <Form.Group>
                    <Form.Label className="text-bold text-black">
                      Description
                    </Form.Label>
                    <textarea
                      className="form-control"
                      placeholder="Enter description here...."
                      value={addPreviewLink.values.description}
                      onChange={addPreviewLink.handleChange("description")}
                      onBlur={addPreviewLink.handleBlur("description")}
                    />
                    {addPreviewLink.errors.description && (
                      <small className="text-danger">
                        {addPreviewLink.errors.description}
                      </small>
                    )}
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Label className="fw-bold">Link</Form.Label>
                  <Form.Control
                    type="text"
                    autoComplete="off"
                    placeholder="e.g https://youtu.be/somethingetc"
                    className="form-control form-control-user"
                    value={addPreviewLink.values.link}
                    onChange={addPreviewLink.handleChange("link")}
                    onBlur={addPreviewLink.handleBlur("link")}
                  />
                  {addPreviewLink.errors.link && (
                    <small className="text-danger">
                      {addPreviewLink.errors.link}
                    </small>
                  )}
                </Col>

                <Col md={12} className="my-2">
                  <Row>
                    <Col lg={8}>
                      <Form.Group>
                        <Form.Label
                          htmlFor="exampleInputPI"
                          className="text-bold text-black"
                        >
                          Preview Image
                        </Form.Label>
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          id="exampleInputPI"
                          ref={fileInputRef}
                          onChange={(event) => handleFileChange(event)}
                        />
                        {addPreviewLink.errors.primaryImage && (
                          <small className="text-danger">
                            {addPreviewLink.errors.primaryImage}
                          </small>
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={4} style={{ textAlign: "center" }}>
                      <img
                        src={
                          addPreviewLink.values.primaryImage instanceof Blob
                            ? URL.createObjectURL(
                                addPreviewLink.values.primaryImage,
                              )
                            : addPreviewLink.values.primaryImage
                              ? addPreviewLink.values.primaryImage
                              : defaultIconImage
                        }
                        className="rounded-circle"
                        width={100}
                        height={100}
                        alt="user-profile"
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </>
        }
        footer={
          <>
            <button
              className="btn btn-secondary"
              type="submit"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              disabled={showSpinner}
              onClick={addPreviewLink.handleSubmit}
            >
              {showSpinner ? (
                <span>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                </span>
              ) : !addPreviewLink.values.isUpdate ? (
                "Add"
              ) : (
                "Update"
              )}
            </button>
          </>
        }
      />

      <CustomModal
        show={showDeleteModal}
        onHide={handleCloseModal}
        size="md"
        classes="bg-danger text-white py-2"
        title={"Delete"}
        body={
          <>
            <p>
              Are you absolutely certain you want to permanently delete this
              record? Please be aware that deleting this record is an
              irreversible action.
            </p>
            <p>Please reaffirm your decision to proceed.</p>
          </>
        }
        footer={
          <>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={deletePreviewLinkRecord}
            >
              {showSpinner ? (
                <span>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                </span>
              ) : (
                "Confirm"
              )}
            </button>
          </>
        }
      />
    </>
  );
};

export default PreviewLink;
