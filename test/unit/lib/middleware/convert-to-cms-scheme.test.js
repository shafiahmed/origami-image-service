'use strict';

const assert = require('proclaim');

describe('lib/middleware/convert-to-cms-scheme', () => {
	let convertToCmsScheme;
	let origamiService;

	beforeEach(() => {
		origamiService = require('../../mock/origami-service.mock');
		convertToCmsScheme = require('../../../../lib/middleware/convert-to-cms-scheme');
	});

	it('exports a function', () => {
		assert.isFunction(convertToCmsScheme);
	});

	describe('convertToCmsScheme()', () => {
		let middleware;

		beforeEach(() => {
			middleware = convertToCmsScheme();
		});

		it('returns a middleware function', () => {
			assert.isFunction(middleware);
		});

		describe('middleware(request, response, next)', () => {

			describe('when the `imageUrl` request param does not point to a known CMS image store', () => {

				beforeEach(done => {
					origamiService.mockRequest.params.imageUrl = 'http://foo.bar/image.jpg';
					middleware(origamiService.mockRequest, origamiService.mockResponse, done);
				});

				it('does nothing to the `imageUrl` request param', () => {
					assert.strictEqual(origamiService.mockRequest.params.imageUrl, 'http://foo.bar/image.jpg');
				});

			});

			describe('when the `imageUrl` request param points to an image in prod-upp-image-read.ft.com', () => {

				beforeEach(done => {
					origamiService.mockRequest.params.imageUrl = 'http://prod-upp-image-read.ft.com/d4e0c8c7-adb0-4171-bc98-e01a7d07d7ef';
					middleware(origamiService.mockRequest, origamiService.mockResponse, done);
				});

				it('sets the `imageUrl` request param to an `ftcms` URL with the image ID', () => {
					assert.strictEqual(origamiService.mockRequest.params.imageUrl, 'ftcms:d4e0c8c7-adb0-4171-bc98-e01a7d07d7ef');
				});

			});

			describe('when the `imageUrl` request param points to an image in the imagepublish S3 bucket', () => {

				beforeEach(done => {
					origamiService.mockRequest.params.imageUrl = 'https://com.ft.imagepublish.prod.s3.amazonaws.com/d4e0c8c7-adb0-4171-bc98-e01a7d07d7ef';
					middleware(origamiService.mockRequest, origamiService.mockResponse, done);
				});

				it('sets the `imageUrl` request param to an `ftcms` URL with the image ID', () => {
					assert.strictEqual(origamiService.mockRequest.params.imageUrl, 'ftcms:d4e0c8c7-adb0-4171-bc98-e01a7d07d7ef');
				});

			});

			describe('when the `imageUrl` request param points to an image in the imagepublish US S3 bucket', () => {

				beforeEach(done => {
					origamiService.mockRequest.params.imageUrl = 'https://com.ft.imagepublish.prod-us.s3.amazonaws.com/d4e0c8c7-adb0-4171-bc98-e01a7d07d7ef';
					middleware(origamiService.mockRequest, origamiService.mockResponse, done);
				});

				it('sets the `imageUrl` request param to an `ftcms` URL with the image ID', () => {
					assert.strictEqual(origamiService.mockRequest.params.imageUrl, 'ftcms:d4e0c8c7-adb0-4171-bc98-e01a7d07d7ef');
				});

			});

         describe('when the `imageUrl` request param points to an image in the imagepublish K8S EU S3 bucket', () => {

				beforeEach(done => {
					origamiService.mockRequest.params.imageUrl = 'http://com.ft.imagepublish.upp-prod-eu.s3.amazonaws.com/26a7951a-c3e4-11e7-b30e-a7c1c7c13aab';
					middleware(origamiService.mockRequest, origamiService.mockResponse, done);
				});

				it('sets the `imageUrl` request param to an `ftcms` URL with the image ID', () => {
					assert.strictEqual(origamiService.mockRequest.params.imageUrl, 'ftcms:26a7951a-c3e4-11e7-b30e-a7c1c7c13aab');
				});

			});

         describe('when the `imageUrl` request param points to an image in the imagepublish K8S US S3 bucket', () => {

				beforeEach(done => {
					origamiService.mockRequest.params.imageUrl = 'http://com.ft.imagepublish.upp-prod-us.s3.amazonaws.com/26a7951a-c3e4-11e7-b30e-a7c1c7c13aab';
					middleware(origamiService.mockRequest, origamiService.mockResponse, done);
				});

				it('sets the `imageUrl` request param to an `ftcms` URL with the image ID', () => {
					assert.strictEqual(origamiService.mockRequest.params.imageUrl, 'ftcms:26a7951a-c3e4-11e7-b30e-a7c1c7c13aab');
				});

			});

			describe('when the `imageUrl` request param points to an image on im.ft-static.com', () => {

				beforeEach(done => {
					origamiService.mockRequest.params.imageUrl = 'https://im.ft-static.com/content/images/d4e0c8c7-adb0-4171-bc98-e01a7d07d7ef.img';
					middleware(origamiService.mockRequest, origamiService.mockResponse, done);
				});

				it('sets the `imageUrl` request param to an `ftcms` URL with the image ID', () => {
					assert.strictEqual(origamiService.mockRequest.params.imageUrl, 'ftcms:d4e0c8c7-adb0-4171-bc98-e01a7d07d7ef');
				});

			});
			
			describe('when the `imageUrl` request param points to an image on d1e00ek4ebabms.cloudfront.net', () => {

				beforeEach(done => {
					origamiService.mockRequest.params.imageUrl = 'http://d1e00ek4ebabms.cloudfront.net/production/817dd37c-b808-4b32-9db2-d50bdd92372b.jpg';
					middleware(origamiService.mockRequest, origamiService.mockResponse, done);
				});

				it('sets the `imageUrl` request param to an `ftcms` URL with the image ID', () => {
					assert.strictEqual(origamiService.mockRequest.params.imageUrl, 'ftcms:817dd37c-b808-4b32-9db2-d50bdd92372b');
				});

			});
			
			describe('when the `imageUrl` request param points to an image on cct-images.ft.com', () => {

				beforeEach(done => {
					origamiService.mockRequest.params.imageUrl = 'http://cct-images.ft.com/production/817dd37c-b808-4b32-9db2-d50bdd92372b.jpg';
					middleware(origamiService.mockRequest, origamiService.mockResponse, done);
				});

				it('sets the `imageUrl` request param to an `ftcms` URL with the image ID', () => {
					assert.strictEqual(origamiService.mockRequest.params.imageUrl, 'ftcms:817dd37c-b808-4b32-9db2-d50bdd92372b');
				});

			});

			describe('when the `imageUrl` request param points to an image on im.ft-static.com with a "png" extension', () => {

				beforeEach(done => {
					origamiService.mockRequest.params.imageUrl = 'https://im.ft-static.com/content/images/d4e0c8c7-adb0-4171-bc98-e01a7d07d7ef.png';
					middleware(origamiService.mockRequest, origamiService.mockResponse, done);
				});

				it('sets the `imageUrl` request param to an `ftcms` URL with the image ID', () => {
					assert.strictEqual(origamiService.mockRequest.params.imageUrl, 'ftcms:d4e0c8c7-adb0-4171-bc98-e01a7d07d7ef');
				});

			});

			describe('when the `imageUrl` request param has a querystring', () => {

				beforeEach(done => {
					origamiService.mockRequest.params.imageUrl = 'https://im.ft-static.com/content/images/d4e0c8c7-adb0-4171-bc98-e01a7d07d7ef.img?foo=bar';
					middleware(origamiService.mockRequest, origamiService.mockResponse, done);
				});

				it('sets the `imageUrl` request param to an `ftcms` URL with the query intact', () => {
					assert.strictEqual(origamiService.mockRequest.params.imageUrl, 'ftcms:d4e0c8c7-adb0-4171-bc98-e01a7d07d7ef?foo=bar');
				});

			});

			describe('when the `imageUrl` request param is a protocol-relative URL', () => {

				beforeEach(done => {
					origamiService.mockRequest.params.imageUrl = '//im.ft-static.com/content/images/d4e0c8c7-adb0-4171-bc98-e01a7d07d7ef.img?foo=bar';
					middleware(origamiService.mockRequest, origamiService.mockResponse, done);
				});

				it('sets the `imageUrl` request param to an `ftcms` URL with the query intact', () => {
					assert.strictEqual(origamiService.mockRequest.params.imageUrl, 'ftcms:d4e0c8c7-adb0-4171-bc98-e01a7d07d7ef?foo=bar');
				});

			});

		});

	});

});
