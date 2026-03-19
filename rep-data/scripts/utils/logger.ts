/**
 * Logger utility for pipeline execution
 * Provides consistent, formatted logging across all phases
 */

export interface LoggerConfig {
  verbose?: boolean;
  logFile?: string;
}

export class Logger {
  private verbose: boolean;
  private logFile?: string;
  private startTime: Date;

  constructor(config: LoggerConfig = {}) {
    this.verbose = config.verbose ?? true;
    this.logFile = config.logFile;
    this.startTime = new Date();
  }

  private formatTime(date: Date): string {
    return date.toISOString().split('T')[1].split('.')[0]; // HH:MM:SS
  }

  private getElapsed(): string {
    const ms = new Date().getTime() - this.startTime.getTime();
    const seconds = (ms / 1000).toFixed(1);
    return `${seconds}s`;
  }

  private output(level: string, message: string, data?: any): void {
    const timestamp = this.formatTime(new Date());
    const elapsed = this.getElapsed();

    let output = `[${timestamp}] ${level} ${message}`;

    if (this.verbose && data) {
      output += ` ${JSON.stringify(data, null, 2)}`;
    }

    console.log(output);

    // TODO: Write to logFile if configured
  }

  info(message: string, data?: any): void {
    this.output('ℹ ', message, data);
  }

  success(message: string, data?: any): void {
    this.output('✓ ', message, data);
  }

  warn(message: string, data?: any): void {
    this.output('⚠ ', message, data);
  }

  error(message: string, error?: Error | string): void {
    if (error instanceof Error) {
      this.output('✗ ', message, {
        message: error.message,
        stack: error.stack
      });
    } else {
      this.output('✗ ', message, error);
    }
  }

  section(title: string): void {
    console.log('\n' + '='.repeat(60));
    console.log(`  ${title}`);
    console.log('='.repeat(60) + '\n');
  }

  table(data: any[]): void {
    if (this.verbose && data.length > 0) {
      console.table(data.slice(0, 10)); // Show first 10 rows
      if (data.length > 10) {
        console.log(`... and ${data.length - 10} more rows`);
      }
    }
  }

  debug(message: string, data?: any): void {
    if (this.verbose) {
      this.output('🐛', message, data);
    }
  }
}

export default Logger;
