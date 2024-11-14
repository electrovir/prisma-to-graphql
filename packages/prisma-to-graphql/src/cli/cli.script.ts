#!/usr/bin/env node

/**
 * This is the entry point to the `prisma-to-graphql` Prisma generator from Prisma itself. Prisma
 * will call this file which then registers the generator within Prisma. Prisma then eventually
 * calls the registered generator.
 */

import {registerGenerator} from './register-generator.js';

registerGenerator();
