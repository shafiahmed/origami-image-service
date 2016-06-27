'use strict';

const assert = require('chai').assert;
const mockery = require('mockery');
const sinon = require('sinon');

describe('lib/middleware/process-image-request', () => {
	let cloudinaryTransform;
	let express;
	let ImageTransform;
	let imgixTransform;
	let processImageRequest;

	beforeEach(() => {

		express = require('../../mock/express.mock');
		mockery.registerMock('express', express);

		ImageTransform = sinon.stub();
		mockery.registerMock('../image-transform', ImageTransform);

		cloudinaryTransform = sinon.stub();
		mockery.registerMock('../transformers/cloudinary', cloudinaryTransform);

		imgixTransform = sinon.stub();
		mockery.registerMock('../transformers/imgix', imgixTransform);

		processImageRequest = require('../../../../lib/middleware/process-image-request');
	});

	it('exports a function', () => {
		assert.isFunction(processImageRequest);
	});

	describe('processImageRequest(config)', () => {
		let config;
		let middleware;

		beforeEach(() => {
			config = {
				imgixSecureUrlToken: 'foo',
				imgixSourceName: 'bar',
				cloudinaryAccountName: 'baz'
			};
			middleware = processImageRequest(config);
		});

		it('returns a middleware function', () => {
			assert.isFunction(middleware);
		});

		describe('middleware(request, response, next)', () => {
			let error;
			let mockImageTransform;
			let next;

			beforeEach(() => {
				next = sinon.spy();

				mockImageTransform = {};
				ImageTransform.returns(mockImageTransform);

				cloudinaryTransform.returns('mock-cloudinary-url');
				imgixTransform.returns('mock-imgix-url');

				express.mockRequest.params[0] = 'mock-uri';
				express.mockRequest.query.source = 'mock-source';

				middleware(express.mockRequest, express.mockResponse, next);
			});

			it('sets the request query `uri` property to the first captured parameter', () => {
				assert.strictEqual(express.mockRequest.query.uri, express.mockRequest.params[0]);
			});

			it('creates an image transform using the query parameters', () => {
				assert.calledOnce(ImageTransform);
				assert.calledWithNew(ImageTransform);
				assert.calledWithExactly(ImageTransform, express.mockRequest.query);
			});

			it('generates a Cloudinary transform URL with the image transform', () => {
				assert.calledOnce(cloudinaryTransform);
				assert.strictEqual(cloudinaryTransform.firstCall.args[0], mockImageTransform);
				assert.deepEqual(cloudinaryTransform.firstCall.args[1], {
					cloudinaryAccountName: config.cloudinaryAccountName
				});
			});

			it('does not generate an Imgix tranform URL', () => {
				assert.notCalled(imgixTransform);
			});

			it('sets the request `transform` property to the created image transform', () => {
				assert.strictEqual(express.mockRequest.transform, mockImageTransform);
			});

			it('sets the request `appliedTransform` property to the Cloudinary URL', () => {
				assert.strictEqual(express.mockRequest.appliedTransform, 'mock-cloudinary-url');
			});

			it('calls `next` with no error', () => {
				assert.calledOnce(next);
				assert.calledWithExactly(next);
			});

			describe('when `request.query.transformer` is "imgix"', () => {

				beforeEach(() => {
					cloudinaryTransform.reset();
					imgixTransform.reset();
					express.mockRequest.query.transformer = 'imgix';
					middleware(express.mockRequest, express.mockResponse, next);
				});

				it('generates an Imgix transform URL with the image transform', () => {
					assert.calledOnce(imgixTransform);
					assert.strictEqual(imgixTransform.firstCall.args[0], mockImageTransform);
					assert.deepEqual(imgixTransform.firstCall.args[1], {
						imgixSecureUrlToken: config.imgixSecureUrlToken,
						imgixSourceName: config.imgixSourceName
					});
				});

				it('does not generate a Cloudinary tranform URL', () => {
					assert.notCalled(cloudinaryTransform);
				});

				it('sets the request `appliedTransform` property to the Imgix URL', () => {
					assert.strictEqual(express.mockRequest.appliedTransform, 'mock-imgix-url');
				});

			});

			describe('when ImageTransform throws an error', () => {
				let imageTransformError;

				beforeEach(() => {
					next.reset();
					imageTransformError = new Error('image tranform error');
					ImageTransform.throws(imageTransformError);
					middleware(express.mockRequest, express.mockResponse, next);
				});

				it('sets the error `status` property to 400', () => {
					assert.strictEqual(imageTransformError.status, 400);
				});

				it('calls `next` with the error', () => {
					assert.calledOnce(next);
					assert.calledWithExactly(next, imageTransformError);
				});

			});

			describe('when `request.query.source` is undefined', () => {

				beforeEach(() => {
					next.reset();
					delete express.mockRequest.query.source;
					middleware(express.mockRequest, express.mockResponse, next);
				});

				it('calls `next` with a HTTP 400 error', () => {
					assert.calledOnce(next);
					const error = next.firstCall.args[0];
					assert.instanceOf(error, Error);
					assert.strictEqual(error.status, 400);
					assert.strictEqual(error.message, 'The source parameter is required');
				});

			});

			cloudinaryTransform

		});

	});

});